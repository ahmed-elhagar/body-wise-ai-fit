import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { MealPlanError, createUserFriendlyError, handleMealPlanError, errorCodes } from './enhancedErrorHandling.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ENHANCED AI model configuration with proper fallback chain
async function getAIModelConfig(supabase: any) {
  try {
    console.log('🔍 Fetching AI model configuration for meal_plan feature...');
    
    const { data, error } = await supabase
      .from('ai_feature_models')
      .select(`
        primary_model:ai_models!primary_model_id(
          model_id,
          provider,
          is_active,
          name
        ),
        fallback_model:ai_models!fallback_model_id(
          model_id,
          provider,
          is_active,
          name
        )
      `)
      .eq('feature_name', 'meal_plan')
      .eq('is_active', true)
      .single();

    // Get the default model from admin panel (marked with star icon)
    const { data: defaultModel, error: defaultError } = await supabase
      .from('ai_models')
      .select('model_id, provider, name')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    const systemDefault = defaultModel ? {
      modelId: defaultModel.model_id,
      provider: defaultModel.provider,
      name: `${defaultModel.name} (Admin Default)`
    } : {
      modelId: 'gpt-4o-mini',
      provider: 'openai',
      name: 'GPT-4o Mini (System Fallback)'
    };

    if (error || !data?.primary_model) {
      console.warn('⚠️ No AI model configured for meal_plan, using admin default');
      return {
        primary: systemDefault,
        fallback: systemDefault
      };
    }

    const config = {
      primary: {
        modelId: data.primary_model.model_id,
        provider: data.primary_model.provider,
        name: data.primary_model.name
      },
      fallback: data.fallback_model ? {
        modelId: data.fallback_model.model_id,
        provider: data.fallback_model.provider,
        name: data.fallback_model.name
      } : systemDefault
    };

    console.log('✅ AI model configuration loaded:', {
      primary: `${config.primary.name} (${config.primary.modelId})`,
      fallback: `${config.fallback.name} (${config.fallback.modelId})`
    });

    return config;
  } catch (error) {
    console.error('❌ Error fetching AI model config:', error);
    
    // Get admin default as final fallback
    try {
      const { data: defaultModel } = await supabase
        .from('ai_models')
        .select('model_id, provider, name')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      const adminDefault = defaultModel ? {
        modelId: defaultModel.model_id,
        provider: defaultModel.provider,
        name: `${defaultModel.name} (Admin Default)`
      } : {
        modelId: 'gpt-4o-mini',
        provider: 'openai',
        name: 'GPT-4o Mini (Final Fallback)'
      };

      return {
        primary: adminDefault,
        fallback: adminDefault
      };
    } catch (fallbackError) {
      return {
        primary: { modelId: 'gpt-4o-mini', provider: 'openai', name: 'GPT-4o Mini (Error Fallback)' },
        fallback: { modelId: 'gpt-4o-mini', provider: 'openai', name: 'GPT-4o Mini (Error Fallback)' }
      };
    }
  }
}

// Calculate daily calories based on user profile
function calculateDailyCalories(userProfile: any, preferences: any) {
  const { age, weight, height, gender, activity_level, fitness_goal } = userProfile;
  
  // Base metabolic rate calculation (Mifflin-St Jeor)
  let bmr = 0;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Activity factor
  const activityFactors = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  
  let tdee = bmr * (activityFactors[activity_level] || 1.55);
  
  // Adjust for fitness goal
  if (fitness_goal === 'weight_loss') {
    tdee *= 0.8; // 20% deficit
  } else if (fitness_goal === 'muscle_gain') {
    tdee *= 1.1; // 10% surplus
  }
  
  // Special conditions adjustments
  if (userProfile.pregnancy_trimester === 2) {
    tdee += 340;
  } else if (userProfile.pregnancy_trimester === 3) {
    tdee += 450;
  }
  
  if (userProfile.breastfeeding_level === 'exclusive') {
    tdee += 400;
  } else if (userProfile.breastfeeding_level === 'partial') {
    tdee += 250;
  }
  
  return Math.round(tdee);
}

// IMPROVED AI prompt for reliable JSON generation
function generateMealPlanPrompt(userProfile: any, preferences: any, dailyCalories: number, includeSnacks: boolean) {
  const language = preferences?.language || userProfile?.preferred_language || 'en';
  const mealsPerDay = includeSnacks ? 5 : 3;
  
  const mealTypes = includeSnacks 
    ? ['breakfast', 'snack', 'lunch', 'snack', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  // Build comprehensive user context
  const userContext = buildUserContext(userProfile, preferences, language);
  
  const finalPrompt = `You are a professional nutritionist AI. Generate a complete 7-day meal plan in STRICT JSON format.

USER PROFILE:
${userContext}

REQUIREMENTS:
- Total meals needed: ${mealsPerDay * 7} meals (${mealsPerDay} per day × 7 days)
- Daily calorie target: ~${dailyCalories} calories
- Meal types per day: ${mealTypes.join(', ')}
- Language: ${language}

CRITICAL JSON STRUCTURE - RETURN EXACTLY THIS FORMAT:
{
  "meals": [
    {
      "day_number": 1,
      "meal_type": "breakfast",
      "name": "Scrambled Eggs with Toast",
      "calories": 400,
      "protein": 25,
      "carbs": 35,
      "fat": 18,
      "ingredients": [
        {"name": "eggs", "amount": "2 large", "calories": 140},
        {"name": "bread", "amount": "2 slices", "calories": 160},
        {"name": "butter", "amount": "1 tbsp", "calories": 100}
      ],
      "instructions": [
        "Heat butter in pan",
        "Scramble eggs until fluffy",
        "Toast bread until golden",
        "Serve eggs on toast"
      ],
      "prep_time": 5,
      "cook_time": 10,
      "servings": 1
    }
  ]
}

STRICT RULES:
1. Return ONLY valid JSON - no markdown, no explanations
2. Generate exactly ${mealsPerDay * 7} meals
3. Each day must have meals: ${mealTypes.join(', ')}
4. All ingredients must have: name, amount, calories
5. All instructions must be clear steps
6. All numeric values must be numbers (not strings)
7. Ensure balanced nutrition across all meals
8. Include cultural preferences and dietary restrictions

Generate the complete meal plan now:`;

  // Log the complete prompt for debugging
  console.log('📝 COMPLETE AI PROMPT BEING SENT:', finalPrompt);
  
  return finalPrompt;
}

function buildUserContext(userProfile: any, preferences: any, language: string): string {
  const isArabic = language === 'ar';
  
  let context = `
Age: ${userProfile.age}, Gender: ${userProfile.gender}
Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
Activity: ${userProfile.activity_level}, Goal: ${userProfile.fitness_goal}
Nationality: ${userProfile.nationality || 'International'}
`;

  // Dietary restrictions
  if (userProfile.dietary_restrictions?.length > 0) {
    context += `\nDietary Restrictions: ${userProfile.dietary_restrictions.join(', ')}`;
  }
  
  // Allergies
  if (userProfile.allergies?.length > 0) {
    context += `\nAllergies: ${userProfile.allergies.join(', ')}`;
  }
  
  // Health conditions
  if (userProfile.health_conditions?.length > 0) {
    context += `\nHealth Conditions: ${userProfile.health_conditions.join(', ')}`;
  }
  
  // Special conditions
  if (userProfile.pregnancy_trimester) {
    context += `\nPregnancy: Trimester ${userProfile.pregnancy_trimester}`;
  }
  
  if (userProfile.breastfeeding_level) {
    context += `\nBreastfeeding: ${userProfile.breastfeeding_level}`;
  }
  
  if (userProfile.fasting_type) {
    context += `\nFasting: ${userProfile.fasting_type}`;
  }
  
  // Preferences
  if (preferences.cuisine) {
    context += `\nPreferred Cuisine: ${preferences.cuisine}`;
  }
  
  if (preferences.maxPrepTime) {
    context += `\nMax Prep Time: ${preferences.maxPrepTime} minutes`;
  }
  
  return context;
}

// ENHANCED AI API call with better error handling
async function callAIAPI(prompt: string, modelConfig: any, retryCount: number = 0) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new MealPlanError(
      'OpenAI API key not configured in edge function secrets',
      errorCodes.API_KEY_MISSING,
      500,
      false
    );
  }

  console.log(`🤖 Calling AI API with ${modelConfig.name || modelConfig.modelId} (attempt ${retryCount + 1})`);

  // Client-side timeout with proper cleanup
  const timeoutMs = 120000; // 2 minutes for complex meal planning
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ AI API call timeout reached');
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional nutritionist AI. Return ONLY valid JSON format without any markdown formatting, explanations, or additional text. The JSON must be complete and properly formatted with all required fields.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Very low temperature for consistent JSON
        max_tokens: 8000, // Increased for complete responses
        response_format: { type: "json_object" } // Force JSON response
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ AI API error response (${response.status}):`, errorText);
      
      if (response.status === 429) {
        throw new MealPlanError(
          'AI service rate limit exceeded',
          errorCodes.RATE_LIMIT_EXCEEDED,
          429,
          true
        );
      }
      
      throw new MealPlanError(
        `AI API error: ${response.status} - ${errorText}`,
        errorCodes.AI_API_ERROR,
        500,
        true
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new MealPlanError(
        'Empty response from AI API',
        errorCodes.AI_RESPONSE_INVALID,
        500,
        true
      );
    }

    console.log('✅ AI API response received successfully');
    console.log('📏 Response length:', content.length);
    
    return content;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error(`⏰ AI API call timed out (attempt ${retryCount + 1})`);
      throw new MealPlanError(
        `AI API timeout after ${timeoutMs/1000} seconds`,
        errorCodes.AI_API_TIMEOUT,
        408,
        true
      );
    }
    
    console.error(`❌ AI API call failed (attempt ${retryCount + 1}):`, error.message);
    throw error;
  }
}

// Enhanced request parsing with proper nested data extraction
function parseAndValidateRequest(body: any) {
  console.log('🔍 Parsing request body:', typeof body, Object.keys(body || {}));

  let userProfile = null;
  let preferences = null;
  let userLanguage = 'en';

  // Extract userProfile from multiple possible locations
  if (body.userProfile && body.userProfile.id) {
    userProfile = body.userProfile;
    console.log('✅ Found userProfile at top level');
  } else if (body.preferences?.userProfile && body.preferences.userProfile.id) {
    userProfile = body.preferences.userProfile;
    console.log('✅ Found userProfile nested in preferences');
  } else if (body.userData && body.userData.userId) {
    // Transform userData to userProfile format
    userProfile = {
      id: body.userData.userId,
      email: body.userData.email,
      first_name: body.userData.first_name,
      last_name: body.userData.last_name,
      age: body.userData.age,
      gender: body.userData.gender,
      height: body.userData.height,
      weight: body.userData.weight,
      fitness_goal: body.userData.fitness_goal,
      activity_level: body.userData.activity_level,
      preferred_language: body.userData.preferred_language,
      dietary_restrictions: body.userData.dietary_restrictions,
      allergies: body.userData.allergies,
      health_conditions: body.userData.health_conditions,
      special_conditions: body.userData.special_conditions,
      nationality: body.userData.nationality,
      body_shape: body.userData.body_shape,
      pregnancy_trimester: body.userData.pregnancy_trimester,
      breastfeeding_level: body.userData.breastfeeding_level,
      fasting_type: body.userData.fasting_type
    };
    console.log('✅ Transformed userData to userProfile');
  }

  // Extract preferences
  if (body.preferences) {
    preferences = body.preferences;
    console.log('✅ Found preferences');
  }

  // Extract language
  if (body.userLanguage) {
    userLanguage = body.userLanguage;
  } else if (body.preferences?.language) {
    userLanguage = body.preferences.language;
  } else if (userProfile?.preferred_language) {
    userLanguage = userProfile.preferred_language;
  }

  // Log complete user profile for debugging
  console.log('📊 Complete user profile data:', {
    id: userProfile?.id,
    age: userProfile?.age,
    gender: userProfile?.gender,
    weight: userProfile?.weight,
    height: userProfile?.height,
    activity_level: userProfile?.activity_level,
    fitness_goal: userProfile?.fitness_goal,
    nationality: userProfile?.nationality,
    dietary_restrictions: userProfile?.dietary_restrictions,
    allergies: userProfile?.allergies,
    health_conditions: userProfile?.health_conditions,
    special_conditions: userProfile?.special_conditions,
    language: userLanguage
  });

  // Validate required data
  if (!userProfile || !userProfile.id) {
    throw new MealPlanError(
      'User profile with valid ID is required for meal plan generation',
      errorCodes.INVALID_USER_PROFILE,
      400,
      false
    );
  }

  if (!preferences) {
    throw new MealPlanError(
      'Meal plan preferences are required',
      errorCodes.VALIDATION_ERROR,
      400,
      false
    );
  }

  console.log('✅ Validation passed for user:', userProfile.id);

  return {
    userProfile,
    preferences,
    userLanguage,
    weekOffset: body.weekOffset || preferences.weekOffset || 0
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== AI MEAL PLAN GENERATION - ENHANCED WITH ROBUST JSON PARSING ===');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Parse and validate the request
    const { userProfile, preferences, userLanguage, weekOffset } = parseAndValidateRequest(body);

    console.log('✅ Request parsing successful:', {
      userId: userProfile.id,
      weekOffset,
      language: userLanguage,
      includeSnacks: preferences.includeSnacks
    });

    // ENHANCED: Get AI model configuration with admin default fallback
    const modelConfig = await getAIModelConfig(supabase);
    console.log('🤖 Using configured AI models:', {
      primary: `${modelConfig.primary.name} (${modelConfig.primary.modelId})`,
      fallback: `${modelConfig.fallback.name} (${modelConfig.fallback.modelId})`
    });

    // Calculate daily calories based on user profile
    const dailyCalories = calculateDailyCalories(userProfile, preferences);
    console.log('🔥 Calculated daily calories:', dailyCalories);

    // Calculate week start date
    const today = new Date();
    const currentSaturday = new Date(today);
    currentSaturday.setDate(today.getDate() + (6 - today.getDay()));
    const weekStartDate = new Date(currentSaturday);
    weekStartDate.setDate(currentSaturday.getDate() + (weekOffset * 7));
    const weekStartDateStr = weekStartDate.toISOString().split('T')[0];

    console.log('📅 Calculated dates:', {
      today: today.toISOString().split('T')[0],
      weekOffset,
      weekStartDate: weekStartDateStr
    });

    // Check if meal plan already exists for this week
    const { data: existingPlan } = await supabase
      .from('weekly_meal_plans')
      .select('id')
      .eq('user_id', userProfile.id)
      .eq('week_start_date', weekStartDateStr)
      .maybeSingle();

    if (existingPlan) {
      console.log('🔄 Updating existing meal plan:', existingPlan.id);
      
      // Delete existing meals for this week
      await supabase
        .from('daily_meals')
        .delete()
        .eq('weekly_plan_id', existingPlan.id);
    }

    // Generate AI meal plan prompt with complete user data
    const prompt = generateMealPlanPrompt(userProfile, preferences, dailyCalories, preferences.includeSnacks);
    console.log('📝 Generated enhanced prompt for robust JSON generation');

    // ENHANCED: Call AI API with configured models and proper admin default fallback
    let aiResponse;
    let usedModel;
    
    try {
      console.log(`🚀 Attempting primary model: ${modelConfig.primary.name}`);
      aiResponse = await callAIAPI(prompt, modelConfig.primary);
      usedModel = modelConfig.primary;
      console.log('✅ AI generation successful with primary model');
    } catch (primaryError) {
      console.error('❌ Primary model failed:', primaryError.message);
      
      try {
        console.log(`🔄 Trying fallback model: ${modelConfig.fallback.name}`);
        aiResponse = await callAIAPI(prompt, modelConfig.fallback);
        usedModel = modelConfig.fallback;
        console.log('✅ AI generation successful with fallback model');
      } catch (fallbackError) {
        console.error('❌ Both configured models failed:', fallbackError.message);
        throw new MealPlanError(
          'AI meal plan generation failed with all configured models',
          errorCodes.AI_GENERATION_FAILED,
          500,
          true
        );
      }
    }

    // ENHANCED AI response parsing with strict validation
    let mealPlanData;
    try {
      console.log('🔍 Processing AI response...');
      console.log('📄 Raw AI response sample:', aiResponse.substring(0, 500) + '...');
      
      // Parse JSON directly (should be clean with response_format: json_object)
      mealPlanData = JSON.parse(aiResponse);
      
      // Validate response structure
      if (!mealPlanData.meals || !Array.isArray(mealPlanData.meals) || mealPlanData.meals.length === 0) {
        console.error('❌ Invalid meal plan structure:', Object.keys(mealPlanData));
        throw new Error('Invalid meal plan structure: no meals array found');
      }
      
      console.log('✅ AI response parsed successfully');
      console.log('📊 Generated meals count:', mealPlanData.meals.length);
      
      // Validate meal count
      const expectedMealCount = (preferences.includeSnacks ? 5 : 3) * 7;
      if (mealPlanData.meals.length < expectedMealCount * 0.7) { // Allow 30% tolerance
        console.warn(`⚠️ Expected ~${expectedMealCount} meals, got ${mealPlanData.meals.length}`);
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError.message);
      console.error('❌ Response sample:', aiResponse?.substring(0, 2000));
      throw new MealPlanError(
        'Invalid AI response format - JSON parsing failed',
        errorCodes.AI_RESPONSE_INVALID,
        500,
        true
      );
    }

    // Calculate nutritional totals
    const nutritionalTotals = mealPlanData.meals.reduce((totals: any, meal: any) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Create or update weekly plan
    const weeklyPlanData = {
      id: existingPlan?.id || crypto.randomUUID(),
      user_id: userProfile.id,
      week_start_date: weekStartDateStr,
      total_calories: Math.round(nutritionalTotals.calories / 7), // Daily average
      total_protein: Math.round(nutritionalTotals.protein / 7),
      total_carbs: Math.round(nutritionalTotals.carbs / 7),
      total_fat: Math.round(nutritionalTotals.fat / 7),
      generation_prompt: preferences,
      life_phase_context: preferences.nutritionContext || {}
    };

    console.log('💾 Creating/updating weekly plan with calculated nutrition');

    const { data: weeklyPlan, error: weeklyPlanError } = await supabase
      .from('weekly_meal_plans')
      .upsert(weeklyPlanData)
      .select()
      .single();

    if (weeklyPlanError) {
      console.error('❌ Error creating weekly plan:', weeklyPlanError);
      throw new Error(`Failed to create weekly meal plan: ${weeklyPlanError.message}`);
    }

    console.log('✅ Weekly plan created/updated:', weeklyPlan.id);

    // Insert AI-generated meals into database with enhanced validation
    const mealsToInsert = mealPlanData.meals.map((meal: any) => {
      // Validate and normalize meal_type
      let validMealType = meal.meal_type;
      if (meal.meal_type && meal.meal_type.includes('snack')) {
        validMealType = 'snack';
      }
      
      // Ensure required fields have defaults
      return {
        id: crypto.randomUUID(),
        weekly_plan_id: weeklyPlan.id,
        day_number: meal.day_number || 1,
        meal_type: validMealType || 'breakfast',
        name: meal.name || 'Unnamed Meal',
        calories: Math.max(0, meal.calories || 0),
        protein: Math.max(0, meal.protein || 0),
        carbs: Math.max(0, meal.carbs || 0),
        fat: Math.max(0, meal.fat || 0),
        ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
        instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
        prep_time: meal.prep_time || 15,
        cook_time: meal.cook_time || 20,
        servings: meal.servings || 1,
        created_at: new Date().toISOString()
      };
    });

    console.log('🍽️ Inserting validated meals:', mealsToInsert.length);

    const { data: insertedMeals, error: mealsError } = await supabase
      .from('daily_meals')
      .insert(mealsToInsert)
      .select();

    if (mealsError) {
      console.error('❌ Error inserting meals:', mealsError);
      throw new Error(`Failed to create daily meals: ${mealsError.message}`);
    }

    console.log('✅ AI-generated meals inserted successfully:', insertedMeals.length);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'AI meal plan generated successfully',
        weeklyPlanId: weeklyPlan.id,
        totalMeals: insertedMeals.length,
        mealsPerDay: preferences.includeSnacks ? 5 : 3,
        includeSnacks: preferences.includeSnacks,
        weekOffset: weekOffset,
        userId: userProfile.id,
        weekStartDate: weekStartDateStr,
        aiModel: usedModel.name || usedModel.modelId,
        modelProvider: usedModel.provider,
        dailyCalories: dailyCalories,
        nutritionalTotals,
        userProfileData: {
          complete: true,
          age: userProfile.age,
          gender: userProfile.gender,
          weight: userProfile.weight,
          height: userProfile.height,
          activity_level: userProfile.activity_level,
          fitness_goal: userProfile.fitness_goal,
          nationality: userProfile.nationality,
          dietary_restrictions: userProfile.dietary_restrictions,
          allergies: userProfile.allergies,
          health_conditions: userProfile.health_conditions
        },
        sampleRequestJson: {
          userProfile: {
            id: "user-uuid",
            age: 30,
            gender: "male",
            weight: 75,
            height: 180,
            activity_level: "moderately_active",
            fitness_goal: "maintenance",
            nationality: "American",
            dietary_restrictions: ["vegetarian"],
            allergies: ["nuts"],
            health_conditions: [],
            preferred_language: "en"
          },
          preferences: {
            includeSnacks: true,
            cuisine: "mediterranean",
            maxPrepTime: 30,
            language: "en"
          },
          userLanguage: "en",
          weekOffset: 0
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('🚨 Meal Plan Error:', error);
    const errorResponse = handleMealPlanError(error, 'en');
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: errorResponse.statusCode || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
