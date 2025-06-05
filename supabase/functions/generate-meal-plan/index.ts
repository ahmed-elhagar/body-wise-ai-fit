
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { MealPlanError, createUserFriendlyError, handleMealPlanError, errorCodes } from './enhancedErrorHandling.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced request parsing with proper nested data extraction
function parseAndValidateRequest(body: any) {
  console.log('🔍 Parsing request body:', typeof body, Object.keys(body || {}));
  console.log('📝 Raw request body:', JSON.stringify(body, null, 2));

  let userProfile = null;
  let preferences = null;
  let userLanguage = 'en';

  // Extract userProfile from multiple possible locations with better logic
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

  // Extract preferences - should always exist
  if (body.preferences) {
    preferences = body.preferences;
    console.log('✅ Found preferences');
  }

  // Extract language with fallback chain
  if (body.userLanguage) {
    userLanguage = body.userLanguage;
  } else if (body.preferences?.language) {
    userLanguage = body.preferences.language;
  } else if (body.preferences?.userLanguage) {
    userLanguage = body.preferences.userLanguage;
  } else if (userProfile?.preferred_language) {
    userLanguage = userProfile.preferred_language;
  }

  console.log('🔍 Extracted data:', {
    hasUserProfile: !!userProfile,
    userProfileId: userProfile?.id,
    userProfileKeys: userProfile ? Object.keys(userProfile) : [],
    hasPreferences: !!preferences,
    preferencesKeys: preferences ? Object.keys(preferences) : [],
    userLanguage
  });

  // Validate required data with better error messages
  if (!userProfile) {
    console.error('❌ No userProfile found in request body');
    throw new MealPlanError(
      'User profile is required for meal plan generation',
      errorCodes.INVALID_USER_PROFILE,
      400,
      false
    );
  }

  if (!userProfile.id) {
    console.error('❌ userProfile missing ID:', userProfile);
    throw new MealPlanError(
      'User profile must include user ID',
      errorCodes.INVALID_USER_PROFILE,
      400,
      false
    );
  }

  if (!preferences) {
    console.error('❌ No preferences found in request body');
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

// Generate sample meal plan data for testing
function generateSampleMealPlan(userProfile: any, preferences: any, weekStartDate: string) {
  const mealTypes = preferences.includeSnacks 
    ? ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  const sampleMeals = [];
  
  for (let day = 1; day <= 7; day++) {
    for (const mealType of mealTypes) {
      sampleMeals.push({
        id: crypto.randomUUID(),
        day_number: day,
        meal_type: mealType,
        meal_name: `Sample ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Day ${day}`,
        calories: mealType.includes('snack') ? 150 : 400,
        protein: mealType.includes('snack') ? 5 : 25,
        carbs: mealType.includes('snack') ? 20 : 45,
        fat: mealType.includes('snack') ? 8 : 15,
        ingredients: [
          {
            name: 'Sample ingredient',
            amount: '1 cup',
            calories: 100
          }
        ],
        instructions: [
          'Sample cooking instruction 1',
          'Sample cooking instruction 2'
        ],
        prep_time: 15,
        cook_time: 20,
        servings: 1
      });
    }
  }

  return sampleMeals;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION WITH ACTUAL DATABASE STORAGE ===');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Parse and validate the request with enhanced logic
    const { userProfile, preferences, userLanguage, weekOffset } = parseAndValidateRequest(body);

    console.log('✅ Request parsing successful:', {
      userId: userProfile.id,
      weekOffset,
      language: userLanguage,
      mealsPerDay: preferences.includeSnacks ? 5 : 3
    });

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

    // Create or update weekly plan - FIXED: Removed plan_type column
    const weeklyPlanData = {
      id: existingPlan?.id || crypto.randomUUID(),
      user_id: userProfile.id,
      week_start_date: weekStartDateStr,
      total_calories: preferences.includeSnacks ? 2100 : 1800,
      total_protein: preferences.includeSnacks ? 140 : 120,
      total_carbs: preferences.includeSnacks ? 250 : 200,
      total_fat: preferences.includeSnacks ? 80 : 65,
      generation_prompt: preferences,
      life_phase_context: preferences.nutritionContext || {},
      updated_at: new Date().toISOString()
    };

    console.log('💾 Creating/updating weekly plan with data:', weeklyPlanData);

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

    // Generate sample meals
    const sampleMeals = generateSampleMealPlan(userProfile, preferences, weekStartDateStr);
    
    // Insert meals into database with proper meal_type validation
    const mealsToInsert = sampleMeals.map(meal => {
      // Validate and normalize meal_type
      let validMealType = meal.meal_type;
      if (meal.meal_type.includes('snack')) {
        validMealType = 'snack';
      }
      
      return {
        ...meal,
        meal_type: validMealType,
        weekly_plan_id: weeklyPlan.id,
        name: meal.meal_name // Map meal_name to name
      };
    });

    console.log('🍽️ Inserting meals:', mealsToInsert.length);

    const { data: insertedMeals, error: mealsError } = await supabase
      .from('daily_meals')
      .insert(mealsToInsert)
      .select();

    if (mealsError) {
      console.error('❌ Error inserting meals:', mealsError);
      throw new Error(`Failed to create daily meals: ${mealsError.message}`);
    }

    console.log('✅ Meals inserted successfully:', insertedMeals.length);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Meal plan generated successfully',
        weeklyPlanId: weeklyPlan.id,
        totalMeals: insertedMeals.length,
        mealsPerDay: preferences.includeSnacks ? 5 : 3,
        includeSnacks: preferences.includeSnacks,
        weekOffset: weekOffset,
        userId: userProfile.id,
        weekStartDate: weekStartDateStr
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
