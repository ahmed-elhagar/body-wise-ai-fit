
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

const getModelConfiguration = async (supabase: any, featureName: string) => {
  try {
    console.log(`🔍 Fetching AI model configuration for ${featureName} feature...`);
    const { data: modelData, error: modelError } = await supabase
      .from('ai_feature_models')
      .select(`
        primary_model:ai_models!primary_model_id(
          model_id,
          provider,
          is_active
        ),
        fallback_model:ai_models!fallback_model_id(
          model_id,
          provider,
          is_active
        )
      `)
      .eq('feature_name', featureName)
      .eq('is_active', true)
      .single();

    // Get default model as final fallback
    const { data: defaultModelData } = await supabase
      .from('ai_models')
      .select('model_id, provider, is_active')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (!modelError && modelData?.primary_model) {
      const primaryModel = modelData.primary_model as any;
      const fallbackModel = modelData.fallback_model as any;
      const defaultModel = defaultModelData as any;
      
      console.log('✅ Retrieved model configuration:', {
        primary: primaryModel,
        fallback: fallbackModel,
        default: defaultModel
      });

      return {
        primary: {
          modelId: primaryModel.model_id,
          provider: primaryModel.provider,
          isActive: primaryModel.is_active
        },
        fallback: fallbackModel ? {
          modelId: fallbackModel.model_id,
          provider: fallbackModel.provider,
          isActive: fallbackModel.is_active
        } : null,
        default: defaultModel ? {
          modelId: defaultModel.model_id,
          provider: defaultModel.provider,
          isActive: defaultModel.is_active
        } : {
          modelId: 'gpt-4o-mini',
          provider: 'openai',
          isActive: true
        }
      };
    } else {
      console.log('⚠️ No model configuration found, using defaults:', modelError?.message);
      const defaultModel = defaultModelData as any;
      return {
        primary: defaultModel ? {
          modelId: defaultModel.model_id,
          provider: defaultModel.provider,
          isActive: defaultModel.is_active
        } : { modelId: 'gpt-4o-mini', provider: 'openai', isActive: true },
        fallback: { modelId: 'gemini-1.5-flash-8b', provider: 'google', isActive: true },
        default: { modelId: 'gpt-4o-mini', provider: 'openai', isActive: true }
      };
    }
  } catch (error) {
    console.log('❌ Error fetching AI model configuration, using fallback:', error);
    return {
      primary: { modelId: 'gpt-4o-mini', provider: 'openai', isActive: true },
      fallback: { modelId: 'gemini-1.5-flash-8b', provider: 'google', isActive: true },
      default: { modelId: 'gpt-4o-mini', provider: 'openai', isActive: true }
    };
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
          { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
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
  
  // Parse response based on provider
  let content = '';
  if (modelConfig.provider === 'openai') {
    content = data.choices[0].message.content.trim();
  } else if (modelConfig.provider === 'google') {
    content = data.candidates[0].content.parts[0].text.trim();
  } else if (modelConfig.provider === 'anthropic') {
    content = data.content[0].text.trim();
  }
  
  return content;
};

const generateAIMealPlanWithRetry = async (
  userProfile: any,
  preferences: any,
  adjustedDailyCalories: number,
  includeSnacks: boolean,
  language: string,
  nutritionContext: any,
  modelConfigs: any,
  apiKeys: any
) => {
  const systemPrompt = language === 'ar' 
    ? 'أنت خبير تغذية مُحترف بالذكاء الاصطناعي متخصص في التغذية لمراحل الحياة المختلفة مع الوعي المتقدم بالحالات الصحية.'
    : 'You are a professional nutritionist AI specialized in life-phase nutrition with advanced health condition awareness.';

  // Use enhanced prompt generator
  const basePrompt = generateEnhancedMealPlanPrompt(userProfile, preferences, adjustedDailyCalories, includeSnacks);
  const enhancedPrompt = enhancePromptWithLifePhase(basePrompt, nutritionContext, language);

  // Enhanced JSON format instruction with STRICT requirements for COMPLETE 7-day plan
  const jsonFormatPrompt = enhancedPrompt + `

CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE EXACTLY:
1. Return ONLY valid JSON format - NO MARKDOWN, NO COMMENTS, NO EXPLANATIONS
2. Generate EXACTLY 7 COMPLETE DAYS (days 1-7) - NO SHORTCUTS OR PLACEHOLDERS
3. Each day must have ${includeSnacks ? '5 meals' : '3 meals'} - NO EXCEPTIONS
4. NO comments like "// ... (other days)" - GENERATE ALL DAYS FULLY
5. Total daily calories must be approximately ${adjustedDailyCalories} per day
6. NO "..." or "(continue pattern)" - WRITE OUT EVERY SINGLE DAY AND MEAL

REQUIRED JSON STRUCTURE (generate ALL 7 days):
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

MEAL TYPE REQUIREMENTS:
${includeSnacks ? 
  '- 5 meals per day: breakfast, snack, lunch, snack, dinner' : 
  '- 3 meals per day: breakfast, lunch, dinner'
}

ABSOLUTELY MANDATORY:
- Generate ALL 7 days completely (day 1 through day 7)
- NO placeholder text or comments
- NO "..." or "(other days)" 
- VALID JSON only - no markdown code blocks
- Complete ingredient and instruction lists for every meal
- EVERY SINGLE DAY MUST BE FULLY WRITTEN OUT`;

  const maxRetries = 2; // REDUCED FROM 3 TO 2 AS REQUESTED
  let lastError = null;
  let fallbackUsed = false;

  // Array of models to try in order: primary -> fallback -> default
  const modelsToTry = [
    { config: modelConfigs.primary, name: 'primary' },
    ...(modelConfigs.fallback ? [{ config: modelConfigs.fallback, name: 'fallback' }] : []),
    { config: modelConfigs.default, name: 'default' }
  ].filter(model => model.config.isActive && apiKeys[model.config.provider]);

  console.log(`🎯 Models to try in order:`, modelsToTry.map(m => `${m.name}: ${m.config.provider}/${m.config.modelId}`));

  for (const modelToTry of modelsToTry) {
    const { config: modelConfig, name: modelName } = modelToTry;
    
    if (modelName !== 'primary') {
      fallbackUsed = true;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 ${modelName} model attempt ${attempt}/${maxRetries} with ${modelConfig.provider} ${modelConfig.modelId}`);
        
        const content = await callAIProvider(
          modelConfig,
          systemPrompt,
          jsonFormatPrompt,
          apiKeys[modelConfig.provider]
        );

        const parsedPlan = await parseAndValidateAIResponse(content, modelConfig);
        
        // Validate the plan has exactly 7 days
        if (!parsedPlan.days || parsedPlan.days.length !== 7) {
          throw new Error(`Generated plan has ${parsedPlan.days?.length || 0} days instead of 7`);
        }
        
        // Validate each day has correct number of meals
        for (let dayIndex = 0; dayIndex < parsedPlan.days.length; dayIndex++) {
          const day = parsedPlan.days[dayIndex];
          const expectedMeals = includeSnacks ? 5 : 3;
          if (!day.meals || day.meals.length !== expectedMeals) {
            throw new Error(`Day ${dayIndex + 1} has ${day.meals?.length || 0} meals instead of ${expectedMeals}`);
          }
        }
        
        // Validate the plan structure
        if (validateMealPlan(parsedPlan, includeSnacks)) {
          console.log(`✅ ${modelName} model (${modelConfig.provider}) generated valid 7-day meal plan on attempt ${attempt}`);
          return { plan: parsedPlan, usedModel: modelConfig, fallbackUsed };
        } else {
          throw new Error('Generated plan failed validation');
        }
        
      } catch (error) {
        lastError = error;
        console.error(`❌ ${modelName} model (${modelConfig.provider}) attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          console.log(`⏳ Waiting before retry...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    console.log(`❌ ${modelName} model (${modelConfig.provider}) failed all ${maxRetries} attempts, trying next model...`);
  }

  // If all models failed, throw the last error
  console.error('❌ All AI models (primary, fallback, and default) failed to generate a valid 7-day meal plan');
  throw new MealPlanError(
    `All AI models failed: ${lastError?.message || 'Unknown error'}`,
    errorCodes.AI_GENERATION_FAILED,
    500,
    true
  );
};

const parseAndValidateAIResponse = async (content: string, modelConfig: any) => {
  // Enhanced cleaning to handle more edge cases and comments
  const cleanedContent = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/\/\/.*$/gm, '') // Remove comment lines
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\t+/g, ' ') // Replace tabs with spaces
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
    .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
    .trim();
  
  console.log('🔍 Cleaned content length:', cleanedContent.length);
  console.log('🔍 Content preview:', cleanedContent.substring(0, 200) + '...');
  
  let parsedPlan;
  try {
    parsedPlan = JSON.parse(cleanedContent);
  } catch (parseError) {
    console.error(`❌ Failed to parse ${modelConfig.provider} response:`, parseError);
    console.error('❌ Raw response content:', content);
    console.error('❌ Cleaned content:', cleanedContent);
    throw new Error(`Invalid JSON response from ${modelConfig.provider}`);
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
  
  console.log(`✅ Parsed ${modelConfig.provider} plan with ${parsedPlan.days?.length || 0} days`);
  return parsedPlan;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let logId: string | null = null;
  let language = 'en';

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION WITH FALLBACK CHAIN START ===');
    
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get AI model configurations with fallback chain
    const modelConfigs = await getModelConfiguration(supabase, 'meal_plan');

    // Prepare API keys for all providers
    const apiKeys = {
      openai: Deno.env.get('OPENAI_API_KEY'),
      google: Deno.env.get('GOOGLE_API_KEY'),
      anthropic: Deno.env.get('ANTHROPIC_API_KEY')
    };

    // Check if we have at least one working API key
    const hasWorkingApiKey = (modelConfigs.primary.isActive && apiKeys[modelConfigs.primary.provider]) ||
                           (modelConfigs.fallback?.isActive && apiKeys[modelConfigs.fallback.provider]) ||
                           (modelConfigs.default.isActive && apiKeys[modelConfigs.default.provider]);

    if (!hasWorkingApiKey) {
      throw new MealPlanError(
        'No working AI provider configured',
        errorCodes.AI_GENERATION_FAILED,
        500
      );
    }

    console.log('🌐 Enhanced Language Configuration:', { 
      language,
      includeSnacks: preferences?.includeSnacks,
      mealsPerDay: preferences?.includeSnacks ? 5 : 3,
      primaryModel: modelConfigs.primary,
      fallbackModel: modelConfigs.fallback,
      defaultModel: modelConfigs.default
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
      { userProfile, preferences, language, modelConfigs }
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
    
    // Generate AI meal plan with retry and fallback chain
    const { plan: generatedPlan, usedModel, fallbackUsed } = await generateAIMealPlanWithRetry(
      userProfile,
      preferences,
      adjustedDailyCalories,
      includeSnacks,
      language,
      nutritionContext,
      modelConfigs,
      apiKeys
    );

    // Enhanced validation
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
        modelUsed: usedModel,
        fallbackUsed,
        weekOffset: preferences?.weekOffset || 0
      });
    }

    console.log('✅ ENHANCED GENERATION WITH FALLBACK CHAIN COMPLETE:', {
      totalMealsSaved,
      remainingCredits: rateLimitResult.remaining - (rateLimitResult.isPro ? 0 : 1),
      language,
      nutritionContext,
      mealsPerDay,
      includeSnacks,
      modelUsed: usedModel,
      fallbackUsed,
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
      modelUsed: usedModel,
      fallbackUsed,
      message: `✨ Enhanced meal plan generated with ${totalMealsSaved} meals (${mealsPerDay} per day)${lifePhaseAdjustments > 0 ? ` (+${lifePhaseAdjustments} kcal)` : ''} using ${usedModel.provider} ${usedModel.modelId}${fallbackUsed ? ' (fallback used)' : ''} with intelligent model chain`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('=== ENHANCED MEAL PLAN GENERATION WITH FALLBACK CHAIN FAILED ===', error);
    
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
