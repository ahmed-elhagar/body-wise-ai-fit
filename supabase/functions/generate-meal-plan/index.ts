
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateDailyCalories } from './nutritionCalculator.ts';
import { generateMealPlanPrompt } from './promptGenerator.ts';
import { validateMealPlan } from './mealPlanValidator.ts';
import { 
  checkAndDecrementGenerations, 
  saveWeeklyPlan, 
  saveMealsToDatabase, 
  decrementUserGenerations 
} from './databaseOperations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION START ===');
    
    // Parse request body
    let userProfile, preferences;
    try {
      const body = await req.json();
      userProfile = body.userProfile;
      preferences = body.preferences;
      console.log('📋 Request received:', {
        userId: userProfile?.id,
        language: preferences?.language || userProfile?.preferred_language || 'en',
        includeSnacks: preferences?.includeSnacks,
        cuisine: preferences?.cuisine
      });
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid request format',
        details: 'Request body must be valid JSON'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required data
    if (!userProfile?.id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User profile is required',
        details: 'Missing user profile data'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Service configuration error',
        details: 'AI service is temporarily unavailable'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced language detection
    const language = preferences?.language || userProfile?.preferred_language || 'en';
    const isArabic = language === 'ar';
    
    console.log('🌐 Language Configuration:', {
      detectedLanguage: language,
      isArabic,
      userPreferredLanguage: userProfile?.preferred_language,
      requestLanguage: preferences?.language
    });

    // Check generations and get profile data
    let profileData;
    try {
      profileData = await checkAndDecrementGenerations(userProfile);
    } catch (error) {
      console.error('❌ Failed to check user generations:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User validation failed',
        details: error.message || 'Unable to validate user account'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Calculate daily calorie needs
    const dailyCalories = calculateDailyCalories(userProfile);
    console.log('🔥 Calculated daily calories:', dailyCalories);

    // Get includeSnacks from preferences
    const includeSnacks = preferences?.includeSnacks !== false && preferences?.includeSnacks !== 'false';
    const mealsPerDay = includeSnacks ? 5 : 3;
    const totalMeals = mealsPerDay * 7;
    
    console.log(`🍽️ ENHANCED GENERATION CONFIG:`, {
      includeSnacks,
      mealsPerDay,
      totalMeals,
      language,
      isArabic
    });

    // Enhanced system prompt with language support
    const systemPrompt = isArabic ? 
      `أنت خبير تغذية مُحترف بالذكاء الاصطناعي. يجب عليك إنشاء خطة وجبات بهذا الهيكل JSON المحدد بالضبط:

{
  "days": [
    {
      "dayNumber": 1,
      "dayName": "السبت",
      "meals": [
        {
          "type": "breakfast",
          "name": "اسم الوجبة",
          "calories": 500,
          "protein": 25,
          "carbs": 60,
          "fat": 20,
          "ingredients": ["مكون1", "مكون2"],
          "instructions": ["خطوة1", "خطوة2"],
          "prepTime": 15,
          "cookTime": 20,
          "servings": 2
        }
      ]
    }
  ],
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "متوازن"
  }
}

المتطلبات الأساسية:
1. أنشئ بالضبط 7 أيام بدءاً من السبت (رقم اليوم 1-7)
2. كل يوم يجب أن يحتوي على ${mealsPerDay} وجبات بالضبط
3. أنواع الوجبات: ${includeSnacks ? 'breakfast, lunch, dinner, snack1, snack2' : 'breakfast, lunch, dinner'}
4. أرجع JSON صحيح فقط - بدون markdown، بدون تفسيرات
5. جميع القيم الرقمية يجب أن تكون أرقام وليس نصوص
6. ركز على المطبخ ${userProfile?.nationality || 'العالمي'}
7. اجعل أسماء الوجبات والمكونات والتعليمات باللغة العربية` :

      `You are a professional nutritionist AI. You MUST generate a meal plan in this EXACT JSON structure:

{
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Saturday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "calories": 500,
          "protein": 25,
          "carbs": 60,
          "fat": 20,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "prepTime": 15,
          "cookTime": 20,
          "servings": 2
        }
      ]
    }
  ],
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "balanced"
  }
}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 7 days starting with Saturday (dayNumber 1-7)
2. Each day must have EXACTLY ${mealsPerDay} meals
3. Meal types: ${includeSnacks ? 'breakfast, lunch, dinner, snack1, snack2' : 'breakfast, lunch, dinner'}
4. Return ONLY valid JSON - no markdown, no explanations
5. All numeric values must be numbers, not strings
6. Focus on ${userProfile?.nationality || 'international'} cuisine
7. Make meal names, ingredients, and instructions in English`;

    // Generate AI prompt with enhanced language support
    const enhancedPreferences = {
      ...preferences,
      language,
      locale: isArabic ? 'ar-SA' : 'en-US'
    };
    
    const prompt = generateMealPlanPrompt(userProfile, enhancedPreferences, dailyCalories, includeSnacks);

    console.log('🤖 Sending enhanced request to OpenAI...');
    
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 8000,
          top_p: 0.8,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false
        }),
      });
    } catch (error) {
      console.error('❌ Failed to connect to OpenAI:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'AI service unavailable',
        details: 'Unable to connect to AI service. Please try again later.'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Service temporarily overloaded',
          details: 'Please try again in a few minutes.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'AI generation failed',
        details: 'Unable to generate meal plan. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('✅ OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid AI response',
        details: 'AI service returned incomplete data. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and clean the response with enhanced error handling
    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      console.log('📝 Raw OpenAI content preview:', content.substring(0, 500) + '...');
      
      // Enhanced JSON cleaning
      let cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*```[\s\S]*?\n/, '')
        .replace(/\n```\s*$/, '')
        .trim();
      
      // Find the JSON object boundaries
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);
      }
      
      generatedPlan = JSON.parse(cleanedContent);
      console.log('✅ Parsed plan structure:', {
        hasDays: !!generatedPlan.days,
        daysCount: generatedPlan.days?.length || 0,
        firstDayMeals: generatedPlan.days?.[0]?.meals?.length || 0,
        weekSummary: !!generatedPlan.weekSummary,
        language: language,
        sampleMealName: generatedPlan.days?.[0]?.meals?.[0]?.name
      });
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content that failed to parse:', data.choices[0].message.content);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'AI response format error',
        details: 'Unable to process AI response. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate the meal plan with enhanced error handling
    try {
      validateMealPlan(generatedPlan, includeSnacks);
      console.log(`✅ VALIDATION PASSED - 7 days with ${totalMeals} expected meals in ${language}`);
    } catch (validationError) {
      console.error('❌ Meal plan validation failed:', validationError);
      console.error('Generated plan that failed validation:', JSON.stringify(generatedPlan, null, 2));
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Generated plan validation failed',
        details: `AI generated an incomplete plan: ${validationError.message}. Please try again.`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Decrement AI generations BEFORE saving
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);

    // Save to database with enhanced logging
    console.log('💾 SAVING ENHANCED MEAL PLAN TO DATABASE...');
    
    let weeklyPlan;
    try {
      // Add language info to preferences for storage
      const enhancedPreferencesForStorage = {
        ...enhancedPreferences,
        generatedLanguage: language
      };
      
      weeklyPlan = await saveWeeklyPlan(userProfile, generatedPlan, enhancedPreferencesForStorage, dailyCalories);
      console.log('✅ Weekly plan saved with ID:', weeklyPlan.id);
    } catch (dbError) {
      console.error('❌ Failed to save weekly plan:', dbError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database save failed',
        details: 'Failed to save meal plan. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Save individual meals
    let totalMealsSaved;
    try {
      const result = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);
      totalMealsSaved = result.totalMealsSaved;
      console.log('✅ Individual meals saved:', totalMealsSaved);
    } catch (dbError) {
      console.error('❌ Failed to save meals:', dbError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Meal save failed',
        details: 'Failed to save individual meals. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ ENHANCED GENERATION COMPLETE:`, {
      totalMealsSaved,
      remainingGenerations,
      language,
      isArabic,
      includeSnacks
    });
    console.log('=== ENHANCED MEAL PLAN GENERATION END ===');
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: remainingGenerations,
      includeSnacks: includeSnacks,
      weekOffset: preferences?.weekOffset || 0,
      language: language,
      message: `✨ ${isArabic ? 'تم إنشاء خطة وجبات محسّنة مع' : 'Enhanced meal plan generated with'} ${totalMealsSaved} ${isArabic ? 'وجبة' : 'meals'}${includeSnacks ? (isArabic ? ' تشمل وجبات خفيفة' : ' including snacks') : ''}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== ENHANCED MEAL PLAN GENERATION FAILED ===');
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Unexpected server error',
      details: `An unexpected error occurred: ${error.message}. Please try again later.`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
