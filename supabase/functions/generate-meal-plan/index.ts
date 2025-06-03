
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
    
    const { userProfile, preferences } = requestBody;
    
    console.log('🔍 Extracted data:', {
      hasUserProfile: !!userProfile,
      userProfileKeys: userProfile ? Object.keys(userProfile) : [],
      hasPreferences: !!preferences,
      preferencesKeys: preferences ? Object.keys(preferences) : []
    });
    
    if (!userProfile || !userProfile.id) {
      throw new MealPlanError(
        'User profile with ID is required',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }
    
    // Validate essential profile fields
    if (!userProfile.age || !userProfile.weight || !userProfile.height) {
      throw new MealPlanError(
        'Complete profile information is required (age, weight, height)',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }
    
    return { userProfile, preferences: preferences || {} };
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

const generateAIMealPlan = async (
  userProfile: any,
  preferences: any,
  adjustedDailyCalories: number,
  includeSnacks: boolean,
  language: string,
  nutritionContext: any,
  modelConfig: any,
  apiKey: string
) => {
  try {
    const systemPrompt = language === 'ar' 
      ? 'أنت خبير تغذية مُحترف بالذكاء الاصطناعي متخصص في التغذية لمراحل الحياة المختلفة مع الوعي المتقدم بالحالات الصحية.'
      : 'You are a professional nutritionist AI specialized in life-phase nutrition with advanced health condition awareness.';

    // Use enhanced prompt generator
    const basePrompt = generateEnhancedMealPlanPrompt(userProfile, preferences, adjustedDailyCalories, includeSnacks);
    const enhancedPrompt = enhancePromptWithLifePhase(basePrompt, nutritionContext, language);

    // Add explicit JSON format instruction with correct meal types
    const jsonFormatPrompt = enhancedPrompt + `

CRITICAL: Return ONLY valid JSON in this exact format:
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "calories": 400,
          "protein": 25,
          "carbs": 45,
          "fat": 15,
          "prep_time": 15,
          "cook_time": 10,
          "servings": 1,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "alternatives": ["alternative1", "alternative2"]
        }
      ]
    }
  ]
}

IMPORTANT MEAL TYPES:
- For snacks, use ONLY "snack" (not snack1, snack2, etc.)
- Valid meal types: breakfast, lunch, dinner, snack
- For ${includeSnacks ? '5 meals per day: breakfast, snack, lunch, snack, dinner' : '3 meals per day: breakfast, lunch, dinner'}
- Total daily calories should be approximately ${adjustedDailyCalories}
- NEVER include comments, explanations, or markdown formatting in the response
- NEVER use placeholder text like "// ... (other 6 days of meals)"
- ALWAYS provide complete data for all 7 days`;

    console.log(`🤖 Sending enhanced request to ${modelConfig.provider} API using model: ${modelConfig.modelId}...`);
    
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
            { role: 'user', content: jsonFormatPrompt }
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
                { text: systemPrompt + '\n\n' + jsonFormatPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8000
          }
        }),
      });
    } else if (modelConfig.provider === 'anthropic') {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          max_tokens: 8000,
          messages: [
            { role: 'user', content: systemPrompt + '\n\n' + jsonFormatPrompt }
          ],
          temperature: 0.1
        }),
      });
    }

    if (!response || !response.ok) {
      const errorText = await response?.text();
      console.error(`❌ ${modelConfig.provider} API error:`, response?.status, errorText);
      throw new Error(`${modelConfig.provider} API error: ${response?.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ ${modelConfig.provider} API response received successfully`);
    
    // Parse response based on provider
    let content = '';
    if (modelConfig.provider === 'openai') {
      content = data.choices[0].message.content.trim();
    } else if (modelConfig.provider === 'google') {
      content = data.candidates[0].content.parts[0].text.trim();
    } else if (modelConfig.provider === 'anthropic') {
      content = data.content[0].text.trim();
    }
    
    // Parse and clean response with enhanced validation
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\/\/.*$/gm, '') // Remove any comment lines
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .trim();
    
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response content:', content);
      console.error('Cleaned content:', cleanedContent);
      throw new MealPlanError(
        'Invalid AI response format',
        errorCodes.AI_GENERATION_FAILED,
        500,
        true
      );
    }
    
    // Validate and sanitize the plan
    if (parsedPlan.days && Array.isArray(parsedPlan.days)) {
      parsedPlan.days = parsedPlan.days.map((day: any) => ({
        ...day,
        meals: day.meals?.map((meal: any) => 
          optimizedDatabaseOperations.sanitizeJsonFields(meal)
        ).filter((meal: any) => 
          optimizedDatabaseOperations.validateMealData(meal)
        ) || []
      }));
    }
    
    return parsedPlan;
  } catch (error) {
    console.error(`❌ ${modelConfig.provider} meal plan generation failed:`, error);
    throw new MealPlanError(
      `AI generation failed: ${error.message}`,
      errorCodes.AI_GENERATION_FAILED,
      500,
      true
    );
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let logId: string | null = null;
  let language = 'en';

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION START ===');
    
    // Parse and validate request
    const requestBody = await req.json();
    console.log('📝 Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { userProfile, preferences } = parseAndValidateRequest(requestBody);
    language = preferences?.language || userProfile?.preferred_language || 'en';
    
    console.log('✅ Validated user profile:', {
      id: userProfile.id,
      age: userProfile.age,
      weight: userProfile.weight,
      height: userProfile.height,
      gender: userProfile.gender
    });
    
    console.log('✅ Validated preferences:', {
      includeSnacks: preferences?.includeSnacks,
      weekOffset: preferences?.weekOffset,
      language: preferences?.language
    });

    // Initialize Supabase client for AI model configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get AI model configuration for meal plan generation
    let modelConfig = { modelId: 'gpt-4o-mini', provider: 'openai' }; // fallback
    
    try {
      console.log('🔍 Fetching AI model configuration for meal_plan feature...');
      const { data: modelData, error: modelError } = await supabase
        .from('ai_feature_models')
        .select(`
          primary_model:ai_models!primary_model_id(
            model_id,
            provider,
            is_active
          )
        `)
        .eq('feature_name', 'meal_plan')
        .eq('is_active', true)
        .single();

      if (!modelError && modelData?.primary_model) {
        const model = modelData.primary_model as any;
        if (model.is_active) {
          modelConfig = {
            modelId: model.model_id,
            provider: model.provider
          };
          console.log('✅ Using configured AI model:', modelConfig);
        } else {
          console.log('⚠️ Configured model is inactive, using fallback');
        }
      } else {
        console.log('⚠️ No model configuration found, using fallback:', modelError?.message);
      }
    } catch (error) {
      console.log('❌ Error fetching AI model configuration, using fallback:', error);
    }

    // Check for required API keys based on provider
    let apiKey: string | null = null;
    if (modelConfig.provider === 'openai') {
      apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        throw new MealPlanError(
          'OpenAI API key not configured',
          errorCodes.AI_GENERATION_FAILED,
          500
        );
      }
    } else if (modelConfig.provider === 'google') {
      apiKey = Deno.env.get('GOOGLE_API_KEY');
      if (!apiKey) {
        throw new MealPlanError(
          'Google API key not configured',
          errorCodes.AI_GENERATION_FAILED,
          500
        );
      }
    } else if (modelConfig.provider === 'anthropic') {
      apiKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (!apiKey) {
        throw new MealPlanError(
          'Anthropic API key not configured',
          errorCodes.AI_GENERATION_FAILED,
          500
        );
      }
    }

    console.log('🌐 Enhanced Language Configuration:', { 
      language,
      includeSnacks: preferences?.includeSnacks,
      mealsPerDay: preferences?.includeSnacks ? 5 : 3,
      aiModel: modelConfig
    });

    // Enhanced rate limiting check
    const rateLimitResult = await enhancedRateLimiting.checkRateLimit(userProfile.id);
    
    if (!rateLimitResult.allowed) {
      throw createUserFriendlyError(errorCodes.RATE_LIMIT_EXCEEDED, language);
    }

    console.log('✅ Rate limit check passed:', {
      remaining: rateLimitResult.remaining,
      isPro: rateLimitResult.isPro
    });

    // Use credit and create log entry
    logId = await enhancedRateLimiting.useCredit(
      userProfile.id,
      'meal_plan',
      { userProfile, preferences, language, modelConfig }
    );

    // Build nutrition context
    const nutritionContext = buildNutritionContext(userProfile);
    console.log('🏥 Enhanced Life-Phase Context:', nutritionContext);

    // Calculate enhanced calories
    const baseDailyCalories = calculateDailyCalories(userProfile);
    const lifePhaseAdjustments = calculateLifePhaseAdjustments(userProfile);
    const adjustedDailyCalories = baseDailyCalories + lifePhaseAdjustments;
    
    console.log('🔥 Enhanced calorie calculation:', {
      base: baseDailyCalories,
      adjustment: lifePhaseAdjustments,
      total: adjustedDailyCalories
    });

    const includeSnacks = preferences?.includeSnacks !== false && preferences?.includeSnacks !== 'false';
    const mealsPerDay = includeSnacks ? 5 : 3;
    
    console.log('🍽️ Meal configuration:', {
      includeSnacks,
      mealsPerDay,
      mealTypes: includeSnacks 
        ? ['breakfast', 'snack', 'lunch', 'snack', 'dinner']
        : ['breakfast', 'lunch', 'dinner'],
      weekOffset: preferences?.weekOffset || 0
    });
    
    // Generate AI meal plan with configured model
    const generatedPlan = await generateAIMealPlan(
      userProfile,
      preferences,
      adjustedDailyCalories,
      includeSnacks,
      language,
      nutritionContext,
      modelConfig,
      apiKey!
    );

    // Enhanced validation
    if (!validateMealPlan(generatedPlan, includeSnacks)) {
      throw new MealPlanError(
        'Generated meal plan failed validation',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }
    
    if (!validateLifePhaseMealPlan(generatedPlan, nutritionContext)) {
      throw new MealPlanError(
        'Life-phase nutrition requirements not met',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Save to database with enhanced error handling
    const weeklyPlan = await saveWeeklyPlan(
      userProfile, 
      generatedPlan, 
      { ...preferences, nutritionContext, language, includeSnacks, mealsPerDay }, 
      adjustedDailyCalories
    );
    
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);

    // Complete generation log as successful
    if (logId) {
      await enhancedRateLimiting.completeGeneration(logId, true, {
        weeklyPlanId: weeklyPlan.id,
        totalMeals: totalMealsSaved,
        nutritionContext,
        mealsPerDay,
        includeSnacks,
        modelUsed: modelConfig,
        weekOffset: preferences?.weekOffset || 0
      });
    }

    console.log('✅ ENHANCED GENERATION COMPLETE:', {
      totalMealsSaved,
      remainingCredits: rateLimitResult.remaining - (rateLimitResult.isPro ? 0 : 1),
      language,
      nutritionContext,
      mealsPerDay,
      includeSnacks,
      modelUsed: modelConfig,
      weekStartDate: weeklyPlan.week_start_date,
      weekOffset: preferences?.weekOffset || 0
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: rateLimitResult.isPro ? -1 : Math.max(rateLimitResult.remaining - 1, 0),
      includeSnacks,
      mealsPerDay,
      weekOffset: preferences?.weekOffset || 0,
      language,
      nutritionContext,
      isPro: rateLimitResult.isPro,
      modelUsed: modelConfig,
      message: `✨ Enhanced meal plan generated with ${totalMealsSaved} meals (${mealsPerDay} per day)${lifePhaseAdjustments > 0 ? ` (+${lifePhaseAdjustments} kcal)` : ''} using ${modelConfig.provider} ${modelConfig.modelId}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('=== ENHANCED MEAL PLAN GENERATION FAILED ===', error);
    
    // Complete generation log as failed
    if (logId) {
      await enhancedRateLimiting.completeGeneration(
        logId, 
        false, 
        undefined, 
        error.message
      );
    }
    
    const errorResponse = handleMealPlanError(error, language);
    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
