
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { MealPlanError, createUserFriendlyError, handleMealPlanError, errorCodes } from './enhancedErrorHandling.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get AI model configuration for meal planning
async function getAIModelConfig(supabase: any) {
  try {
    const { data, error } = await supabase
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
      .eq('feature_name', 'meal_plan')
      .eq('is_active', true)
      .single();

    if (error || !data?.primary_model) {
      console.warn('No AI model configured for meal_plan, using default');
      return {
        primary: { modelId: 'gpt-4o-mini', provider: 'openai' },
        fallback: null
      };
    }

    return {
      primary: {
        modelId: data.primary_model.model_id,
        provider: data.primary_model.provider
      },
      fallback: data.fallback_model ? {
        modelId: data.fallback_model.model_id,
        provider: data.fallback_model.provider
      } : null
    };
  } catch (error) {
    console.error('Error fetching AI model config:', error);
    return {
      primary: { modelId: 'gpt-4o-mini', provider: 'openai' },
      fallback: null
    };
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

// Generate AI meal plan prompt
function generateMealPlanPrompt(userProfile: any, preferences: any, dailyCalories: number, includeSnacks: boolean) {
  const language = preferences?.language || userProfile?.preferred_language || 'en';
  const isArabic = language === 'ar';
  
  const mealsPerDay = includeSnacks ? 5 : 3;
  const mealTypes = includeSnacks 
    ? ['breakfast', 'snack', 'lunch', 'snack', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  const culturalContext = buildCulturalContext(userProfile.nationality, language);
  const dietaryRestrictions = buildDietaryRestrictions(userProfile, language);

  const basePrompt = isArabic ? buildArabicPrompt() : buildEnglishPrompt();
  
  return `${basePrompt}

User Profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activity_level}
- Daily Calorie Target: ${dailyCalories} calories
- Nationality: ${userProfile.nationality || 'International'}
- Fitness Goal: ${userProfile.fitness_goal}

Preferences:
- Cuisine: ${preferences.cuisine || 'mixed'}
- Max Prep Time: ${preferences.maxPrepTime || '30'} minutes
- Meal Types: ${mealTypes.join(', ')}
- Include Snacks: ${includeSnacks}

${dietaryRestrictions}
${culturalContext}

Generate a complete 7-day meal plan with exactly ${mealsPerDay} meals per day.
Each meal must include:
- name (string)
- calories (number)
- protein (number in grams)
- carbs (number in grams) 
- fat (number in grams)
- ingredients (array of objects with name, amount, calories)
- instructions (array of cooking steps)
- prep_time (number in minutes)
- cook_time (number in minutes)
- servings (number, default 1)

Return ONLY valid JSON in this exact format:
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
      "ingredients": [{"name": "ingredient", "amount": "1 cup", "calories": 100}],
      "instructions": ["Step 1", "Step 2"],
      "prep_time": 10,
      "cook_time": 15,
      "servings": 1
    }
  ]
}`;
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

function buildEnglishPrompt(): string {
  return `You are a professional nutritionist AI specializing in personalized meal planning.
Create a comprehensive 7-day meal plan that is culturally appropriate and nutritionally balanced.`;
}

function buildArabicPrompt(): string {
  return `أنت خبير تغذية بالذكاء الاصطناعي متخصص في التخطيط المخصص للوجبات.
أنشئ خطة وجبات شاملة لمدة 7 أيام تكون مناسبة ثقافياً ومتوازنة غذائياً.`;
}

// Enhanced AI API call with proper timeout and error handling
async function callAIAPI(prompt: string, modelConfig: any) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Calling AI API with model:', modelConfig.modelId);

  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('AI API timeout after 45 seconds')), 45000);
  });

  // Create the API call promise
  const apiPromise = fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelConfig.modelId,
      messages: [
        { role: 'system', content: 'You are a professional nutritionist. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  try {
    // Race between API call and timeout
    const response = await Promise.race([apiPromise, timeoutPromise]) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI API error response:', errorText);
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ AI API response received successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ AI API call failed:', error);
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
      special_conditions: body.userData.special_conditions
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
    console.log('=== AI MEAL PLAN GENERATION WITH ENHANCED ERROR HANDLING ===');
    
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

    // Get AI model configuration
    const modelConfig = await getAIModelConfig(supabase);
    console.log('🤖 Using AI model:', modelConfig.primary);

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

    // Generate AI meal plan prompt
    const prompt = generateMealPlanPrompt(userProfile, preferences, dailyCalories, preferences.includeSnacks);
    console.log('📝 Generated prompt for AI');

    // Call AI API with primary model and enhanced error handling
    let aiResponse;
    try {
      aiResponse = await callAIAPI(prompt, modelConfig.primary);
      console.log('✅ AI generation successful with primary model');
    } catch (error) {
      console.error('❌ Primary model failed:', error);
      
      if (modelConfig.fallback) {
        console.log('🔄 Trying fallback model:', modelConfig.fallback);
        try {
          aiResponse = await callAIAPI(prompt, modelConfig.fallback);
          console.log('✅ AI generation successful with fallback model');
        } catch (fallbackError) {
          console.error('❌ Fallback model also failed:', fallbackError);
          throw new MealPlanError(
            'AI meal plan generation failed with both primary and fallback models',
            errorCodes.AI_GENERATION_FAILED,
            500,
            true
          );
        }
      } else {
        throw new MealPlanError(
          'AI meal plan generation failed and no fallback model configured',
          errorCodes.AI_GENERATION_FAILED,
          500,
          true
        );
      }
    }

    // Parse AI response with enhanced error handling
    let mealPlanData;
    try {
      // Clean the response to extract JSON
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      mealPlanData = JSON.parse(cleanedResponse);
      console.log('✅ AI response parsed successfully');
      
      // Validate that we have meals
      if (!mealPlanData.meals || !Array.isArray(mealPlanData.meals) || mealPlanData.meals.length === 0) {
        throw new Error('No meals found in AI response');
      }
      
      console.log('📊 Generated meals count:', mealPlanData.meals.length);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.error('❌ Raw AI response:', aiResponse?.substring(0, 500));
      throw new MealPlanError(
        'Invalid AI response format',
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

    // Create or update weekly plan - REMOVED updated_at field
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

    // Insert AI-generated meals into database
    const mealsToInsert = mealPlanData.meals.map((meal: any) => {
      // Validate and normalize meal_type
      let validMealType = meal.meal_type;
      if (meal.meal_type.includes('snack')) {
        validMealType = 'snack';
      }
      
      return {
        id: crypto.randomUUID(),
        weekly_plan_id: weeklyPlan.id,
        day_number: meal.day_number,
        meal_type: validMealType,
        name: meal.name,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || [],
        prep_time: meal.prep_time || 15,
        cook_time: meal.cook_time || 20,
        servings: meal.servings || 1,
        created_at: new Date().toISOString()
      };
    });

    console.log('🍽️ Inserting AI-generated meals:', mealsToInsert.length);

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
        aiModel: modelConfig.primary.modelId,
        dailyCalories: dailyCalories,
        nutritionalTotals
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
