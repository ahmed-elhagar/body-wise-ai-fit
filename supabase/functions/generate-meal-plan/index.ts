
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

// SIMPLIFIED meal plan prompt for better JSON generation
function generateMealPlanPrompt(userProfile: any, preferences: any, dailyCalories: number, includeSnacks: boolean) {
  const language = preferences?.language || userProfile?.preferred_language || 'en';
  const mealsPerDay = includeSnacks ? 5 : 3;
  const totalMeals = mealsPerDay * 7;
  
  const mealTypes = includeSnacks 
    ? ['breakfast', 'snack', 'lunch', 'snack', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  const culturalContext = buildCulturalContext(userProfile.nationality, language);
  const dietaryRestrictions = buildDietaryRestrictions(userProfile, language);
  const healthConditions = buildHealthConditions(userProfile, language);
  const specialConditions = buildSpecialConditions(userProfile, language);

  // Simplified user profile data
  const userDetails = `
User: ${userProfile.age}yr ${userProfile.gender}, ${userProfile.weight}kg, ${userProfile.height}cm
Activity: ${userProfile.activity_level}, Goal: ${userProfile.fitness_goal}
Nationality: ${userProfile.nationality || 'International'}
Daily Calories: ${dailyCalories}
Meals: ${mealsPerDay} per day (${mealTypes.join(', ')})
Preferences: ${preferences.cuisine || 'Mixed'}, Max prep: ${preferences.maxPrepTime || 30}min
`;

  return `You are a professional nutritionist. Generate a 7-day meal plan in VALID JSON format.

${userDetails}
${healthConditions}
${specialConditions}
${dietaryRestrictions}
${culturalContext}

CRITICAL REQUIREMENTS:
- Generate exactly ${totalMeals} meals (${mealsPerDay} meals × 7 days)
- Each day has meals: ${mealTypes.join(', ')}
- Daily calories ~${dailyCalories}
- Return ONLY valid JSON, no markdown, no explanations

JSON STRUCTURE:
{
  "meals": [
    {
      "day_number": 1,
      "meal_type": "breakfast",
      "name": "Meal Name",
      "calories": 400,
      "protein": 25,
      "carbs": 45,
      "fat": 15,
      "ingredients": [
        {"name": "ingredient", "amount": "1 cup", "calories": 100}
      ],
      "instructions": [
        "Step 1: instruction",
        "Step 2: instruction"
      ],
      "prep_time": 10,
      "cook_time": 15,
      "servings": 1
    }
  ]
}

Generate complete meal plan with ALL ${totalMeals} meals. Return ONLY the JSON.`;
}

function buildCulturalContext(nationality: string, language: string): string {
  const isArabic = language === 'ar';
  
  if (nationality?.includes('Saudi') || nationality?.includes('Arab') || nationality?.includes('Middle East')) {
    return isArabic 
      ? 'السياق الثقافي: ركز على الأطعمة العربية والشرق أوسطية، التمر، المكسرات، الأرز، اللحوم المشوية، والخضروات الطازجة.'
      : 'Cultural Context: Focus on Arabic and Middle Eastern foods including dates, nuts, rice, grilled meats, and fresh vegetables.';
  }
  
  return isArabic 
    ? 'السياق الثقافي: مزج من الأطعمة العالمية مع التركيز على التوازن الغذائي.'
    : 'Cultural Context: International mix of foods focusing on nutritional balance.';
}

function buildDietaryRestrictions(userProfile: any, language: string): string {
  const isArabic = language === 'ar';
  const restrictions = userProfile.dietary_restrictions || [];
  const allergies = userProfile.allergies || [];
  
  if (restrictions.length === 0 && allergies.length === 0) return '';
  
  const title = isArabic ? 'القيود الغذائية:' : 'Dietary Restrictions:';
  const restrictionText = restrictions.length > 0 
    ? `${isArabic ? 'قيود:' : 'Restrictions:'} ${restrictions.join(', ')}`
    : '';
  const allergyText = allergies.length > 0 
    ? `${isArabic ? 'حساسية:' : 'Allergies:'} ${allergies.join(', ')}`
    : '';
    
  return `${title}\n${restrictionText}\n${allergyText}`;
}

function buildHealthConditions(userProfile: any, language: string): string {
  const isArabic = language === 'ar';
  const conditions = userProfile.health_conditions || [];
  
  if (conditions.length === 0) return '';
  
  const title = isArabic ? 'الحالات الصحية:' : 'Health Conditions:';
  return `${title}\n- Conditions: ${conditions.join(', ')}\n- Require specialized nutrition considerations`;
}

function buildSpecialConditions(userProfile: any, language: string): string {
  const isArabic = language === 'ar';
  let sections = [];
  
  // Pregnancy
  if (userProfile.pregnancy_trimester) {
    const title = isArabic ? 'الحمل:' : 'Pregnancy:';
    const trimesterText = isArabic ? `الثلث ${userProfile.pregnancy_trimester}` : `Trimester ${userProfile.pregnancy_trimester}`;
    sections.push(`${title} ${trimesterText} - Additional nutrition requirements (+${userProfile.pregnancy_trimester === 2 ? 340 : 450} calories)`);
  }
  
  // Breastfeeding
  if (userProfile.breastfeeding_level) {
    const title = isArabic ? 'الرضاعة الطبيعية:' : 'Breastfeeding:';
    const extraCalories = userProfile.breastfeeding_level === 'exclusive' ? 400 : 250;
    sections.push(`${title} ${userProfile.breastfeeding_level} - Increased caloric needs (+${extraCalories} calories)`);
  }
  
  // Fasting
  if (userProfile.fasting_type) {
    const title = isArabic ? 'الصيام:' : 'Fasting:';
    sections.push(`${title} ${userProfile.fasting_type} - Meal timing considerations`);
  }
  
  return sections.length > 0 ? `Special Conditions:\n${sections.join('\n')}` : '';
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
            content: 'You are a professional nutritionist AI. Return ONLY valid JSON format without any markdown formatting, explanations, or additional text. Ensure the JSON is complete and properly formatted with all required fields.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 6000, // Increased for complete responses
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
    console.log('🔍 Response preview:', content.substring(0, 200) + '...');
    
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
    console.log('📝 Generated simplified prompt for robust JSON generation');

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

    // ENHANCED AI response parsing with better error handling
    let mealPlanData;
    try {
      console.log('🔍 Processing AI response...');
      console.log('📏 Raw response length:', aiResponse?.length || 0);
      
      // Clean the response
      let cleanedResponse = aiResponse.trim();
      
      // Remove any markdown formatting
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/^\s*```[\s\S]*?```\s*$/g, '');
      
      // Find JSON boundaries more carefully
      const firstBraceIndex = cleanedResponse.indexOf('{');
      const lastBraceIndex = cleanedResponse.lastIndexOf('}');
      
      if (firstBraceIndex === -1 || lastBraceIndex === -1) {
        console.error('❌ No valid JSON structure found in response');
        console.error('📄 Response sample:', cleanedResponse.substring(0, 500));
        throw new Error('No valid JSON structure found in response');
      }
      
      cleanedResponse = cleanedResponse.substring(firstBraceIndex, lastBraceIndex + 1);
      
      console.log('🧹 Cleaned response ready for parsing');
      console.log('📄 Sample of cleaned response:', cleanedResponse.substring(0, 300) + '...');
      
      // Validate JSON structure before parsing
      if (!cleanedResponse.includes('"meals"') || !cleanedResponse.includes('[')) {
        throw new Error('Response does not contain expected meals array structure');
      }
      
      mealPlanData = JSON.parse(cleanedResponse);
      
      // Validate response structure
      if (!mealPlanData.meals || !Array.isArray(mealPlanData.meals) || mealPlanData.meals.length === 0) {
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
