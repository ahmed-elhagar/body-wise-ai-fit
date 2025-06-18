
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateDailyCalories, calculateLifePhaseAdjustments } from './nutritionCalculator.ts';
import { generateEnhancedMealPlanPrompt } from './enhancedPromptGenerator.ts';
import { validateMealPlan, validateLifePhaseMealPlan } from './mealPlanValidator.ts';
import { saveWeeklyPlan } from './weeklyPlanStorage.ts';
import { saveMealsToDatabase } from './mealStorage.ts';
import { buildNutritionContext, enhancePromptWithLifePhase } from './lifePhaseProcessor.ts';
import { optimizedDatabaseOperations } from './databaseOptimization.ts';
import { handleMealPlanError, createUserFriendlyError, errorCodes, MealPlanError } from './enhancedErrorHandling.ts';
import { enhancedRateLimiting } from './rateLimitingEnhanced.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const parseAndValidateRequest = (requestBody: any) => {
  try {
    console.log('🔍 Parsing request body:', typeof requestBody, Object.keys(requestBody || {}));
    
    if (!requestBody) {
      throw new MealPlanError(
        'Request body is required',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }
    
    // Handle both old and new request formats
    let userProfile;
    let preferences;
    
    if (requestBody.userData) {
      // New format: userData and preferences separate
      userProfile = requestBody.userData;
      preferences = requestBody.preferences || {};
    } else if (requestBody.preferences?.userProfile) {
      // Handle nested userProfile in preferences
      userProfile = requestBody.preferences.userProfile;
      preferences = requestBody.preferences;
    } else {
      // Legacy format: userProfile and preferences at root level
      userProfile = requestBody.userProfile;
      preferences = requestBody.preferences || {};
    }
    
    console.log('🔍 Extracted data:', {
      hasUserProfile: !!userProfile,
      userProfileKeys: userProfile ? Object.keys(userProfile) : [],
      hasPreferences: !!preferences,
      preferencesKeys: preferences ? Object.keys(preferences) : []
    });
    
    // Check for user ID in different possible field names
    const userId = userProfile?.id || userProfile?.userId;
    if (!userProfile || !userId) {
      throw new MealPlanError(
        'User profile with ID is required',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }
    
    // Normalize the userProfile to have consistent field names
    const normalizedUserProfile = {
      ...userProfile,
      id: userId // Ensure we always have an 'id' field
    };
    
    // Validate essential profile fields
    if (!normalizedUserProfile.age || !normalizedUserProfile.weight || !normalizedUserProfile.height) {
      throw new MealPlanError(
        'Complete profile information is required (age, weight, height)',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }
    
    return { userProfile: normalizedUserProfile, preferences: preferences || {} };
  } catch (error) {
    if (error instanceof MealPlanError) throw error;
    
    console.error('❌ Request parsing error:', error);
    throw new MealPlanError(
      'Invalid request format',
      errorCodes.VALIDATION_ERROR,
      400,
      true
    );
  }
};

// Simple credit checking function
const checkAndUseCredit = async (supabase: any, userId: string) => {
  try {
    console.log('💳 Checking credits for user:', userId);
    
    // Check if user is Pro (unlimited generations)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    const isPro = !!subscription;
    console.log('👑 User Pro status:', isPro);

    if (isPro) {
      return { allowed: true, remaining: -1 };
    }

    // Check user's remaining credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_generations_remaining')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error checking user credits:', profileError);
      throw new Error('Failed to check user credits');
    }

    const remaining = profile.ai_generations_remaining || 0;
    console.log('💰 User credits remaining:', remaining);

    if (remaining <= 0) {
      return { allowed: false, remaining: 0 };
    }

    // Decrement credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        ai_generations_remaining: remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error updating credits:', updateError);
      throw new Error('Failed to update credits');
    }

    console.log('✅ Credit consumed successfully. Remaining:', remaining - 1);
    return { allowed: true, remaining: remaining - 1 };
  } catch (error) {
    console.error('❌ Credit check failed:', error);
    throw error;
  }
};

const callAIProvider = async (
  modelConfig: any,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
) => {
  console.log(`🤖 Calling ${modelConfig.provider} API with model: ${modelConfig.modelId}...`);
  
  let response;
  
  if (modelConfig.provider === 'openai') {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 8000
      }),
    });
  } else if (modelConfig.provider === 'google') {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + '\n\n' + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8000
        }
      }),
    });
  }

  if (!response || !response.ok) {
    const errorText = await response?.text();
    console.error(`❌ ${modelConfig.provider} API error:`, response?.status, errorText);
    throw new Error(`${modelConfig.provider} API error: ${response?.status} ${errorText}`);
  }

  const data = await response.json();
  
  // Parse response based on provider
  let content = '';
  if (modelConfig.provider === 'openai') {
    content = data.choices[0].message.content.trim();
  } else if (modelConfig.provider === 'google') {
    content = data.candidates[0].content.parts[0].text.trim();
  }
  
  return content;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let language = 'en';

  try {
    console.log('=== MEAL PLAN GENERATION START ===');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey && !googleApiKey) {
      throw new MealPlanError(
        'AI API keys not configured',
        errorCodes.AI_GENERATION_FAILED,
        500
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new MealPlanError(
        'Supabase configuration missing',
        errorCodes.DATABASE_ERROR,
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestBody = await req.json();
    const { userProfile, preferences } = parseAndValidateRequest(requestBody);
    
    language = preferences?.userLanguage || userProfile?.preferred_language || 'en';
    console.log('🌐 Language Configuration:', { language });

    // Check credits first
    const creditResult = await checkAndUseCredit(supabase, userProfile.id);
    
    if (!creditResult.allowed) {
      throw createUserFriendlyError(errorCodes.INSUFFICIENT_CREDITS, language);
    }

    console.log('✅ Credit check passed, generating meal plan...');

    // Calculate nutrition context and daily calories
    const nutritionContext = buildNutritionContext(userProfile);
    const baseDailyCalories = calculateDailyCalories(userProfile);
    const adjustedDailyCalories = baseDailyCalories + nutritionContext.extraCalories;
    
    console.log('📊 Nutrition calculations:', {
      baseDailyCalories,
      extraCalories: nutritionContext.extraCalories,
      adjustedDailyCalories,
      nutritionContext
    });

    // Enhanced prompt generation
    const basePrompt = generateEnhancedMealPlanPrompt(
      userProfile,
      { ...preferences, language },
      adjustedDailyCalories
    );
    const enhancedPrompt = enhancePromptWithLifePhase(basePrompt, nutritionContext, language);

    const systemPrompt = language === 'ar' 
      ? 'أنت خبير تغذية مُحترف بالذكاء الاصطناعي. قم بإنشاء خطط وجبات مخصصة بناءً على بيانات المستخدم. أرجع JSON صالح فقط - بدون تنسيق markdown.'
      : 'You are a professional nutritionist AI. Create personalized meal plans based on user data. Return valid JSON only - no markdown formatting.';

    const includeSnacks = preferences?.includeSnacks !== false;
    const finalPrompt = enhancedPrompt + `

CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE EXACTLY:
1. Return ONLY valid JSON format - NO MARKDOWN, NO COMMENTS, NO EXPLANATIONS
2. Generate EXACTLY 7 COMPLETE DAYS (days 1-7) - NO SHORTCUTS OR PLACEHOLDERS
3. Each day must have ${includeSnacks ? '5 meals' : '3 meals'} - NO EXCEPTIONS
4. Total daily calories must be approximately ${adjustedDailyCalories} per day
5. Generate complete meal plan structure as specified

Return this exact JSON structure:
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "meal name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "prep_time": number,
          "cook_time": number,
          "servings": 1,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "alternatives": ["alt1", "alt2"]
        }
      ]
    }
  ]
}`;

    // Try OpenAI first, then Google as fallback
    let aiResponse = '';
    const modelConfig = { provider: 'openai', modelId: 'gpt-4o-mini' };
    
    try {
      if (openAIApiKey) {
        aiResponse = await callAIProvider(modelConfig, systemPrompt, finalPrompt, openAIApiKey);
      } else if (googleApiKey) {
        modelConfig.provider = 'google';
        modelConfig.modelId = 'gemini-1.5-flash-8b';
        aiResponse = await callAIProvider(modelConfig, systemPrompt, finalPrompt, googleApiKey);
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      throw createUserFriendlyError(errorCodes.AI_GENERATION_FAILED, language);
    }

    // Parse and validate the AI response
    let mealPlan;
    try {
      // Remove any markdown formatting if present
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      mealPlan = JSON.parse(cleanResponse);
      console.log('✅ AI response parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      throw createUserFriendlyError(errorCodes.AI_GENERATION_FAILED, language);
    }

    // Validate the meal plan
    validateMealPlan(mealPlan, includeSnacks);
    validateLifePhaseMealPlan(mealPlan, nutritionContext);

    console.log('✅ Meal plan validation passed');

    // Save to database
    const weeklyPlan = await saveWeeklyPlan(supabase, userProfile.id, mealPlan, {
      adjustedDailyCalories,
      nutritionContext,
      preferences,
      language
    });

    await saveMealsToDatabase(supabase, weeklyPlan.id, mealPlan.days);

    console.log('🎉 Meal plan generated and saved successfully:', {
      weeklyPlanId: weeklyPlan.id,
      userId: userProfile.id,
      language,
      creditsRemaining: creditResult.remaining
    });

    return new Response(JSON.stringify({
      success: true,
      weeklyPlan,
      nutritionContext,
      creditsRemaining: creditResult.remaining,
      message: language === 'ar' ? 'تم إنشاء خطة الوجبات بنجاح' : 'Meal plan generated successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===', error);
    
    const errorResponse = handleMealPlanError(error, language);
    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
