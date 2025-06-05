
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION WITH FALLBACK CHAIN START ===');
    
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

    // Enhanced meal plan generation logic would go here
    // For now, return a success response to test the parsing fix
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Meal plan generation started successfully',
        weeklyPlanId: 'temp-id',
        totalMeals: preferences.includeSnacks ? 35 : 21,
        mealsPerDay: preferences.includeSnacks ? 5 : 3,
        includeSnacks: preferences.includeSnacks,
        weekOffset: weekOffset,
        userId: userProfile.id
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
