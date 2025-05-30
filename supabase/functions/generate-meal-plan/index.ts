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
import { 
  buildNutritionContext, 
  enhancePromptWithLifePhase, 
  validateLifePhaseMealPlan 
} from './lifePhaseProcessor.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ENHANCED MEAL PLAN GENERATION WITH LIFE-PHASE SUPPORT START ===');
    
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

    // NEW: Build life-phase nutrition context
    const nutritionContext = buildNutritionContext(userProfile);
    console.log('🏥 Life-Phase Context:', nutritionContext);

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
    
    // Calculate daily calorie needs WITH life-phase adjustments
    const baseDailyCalories = calculateDailyCalories(userProfile);
    const adjustedDailyCalories = baseDailyCalories + nutritionContext.extraCalories;
    console.log('🔥 Calorie calculation:', {
      base: baseDailyCalories,
      adjustment: nutritionContext.extraCalories,
      total: adjustedDailyCalories
    });

    const includeSnacks = preferences?.includeSnacks !== false && preferences?.includeSnacks !== 'false';
    const mealsPerDay = includeSnacks ? 5 : 3;
    const totalMeals = mealsPerDay * 7;
    
    console.log(`🍽️ ENHANCED GENERATION CONFIG:`, {
      includeSnacks,
      mealsPerDay,
      totalMeals,
      language,
      isArabic,
      nutritionContext
    });

    // Enhanced system prompt with life-phase support
    const baseSystemPrompt = isArabic ? 
      `أنت خبير تغذية مُحترف بالذكاء الاصطناعي متخصص في التغذية لمراحل الحياة المختلفة.` :
      `You are a professional nutritionist AI specialized in life-phase nutrition.`;

    const systemPrompt = baseSystemPrompt + (isArabic ? 
      ` يجب عليك إنشاء خطة وجبات تراعي الظروف الخاصة للمستخدم مثل الصيام والحمل والرضاعة الطبيعية.` :
      ` You must create meal plans that consider special conditions like fasting, pregnancy, and breastfeeding.`);

    // Generate AI prompt with life-phase enhancements
    const basePrompt = generateMealPlanPrompt(userProfile, preferences, adjustedDailyCalories, includeSnacks);
    const enhancedPrompt = enhancePromptWithLifePhase(basePrompt, nutritionContext, language);

    console.log('🤖 Sending enhanced life-phase request to OpenAI...');
    
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
            { role: 'user', content: enhancedPrompt }
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

    // Parse and validate with life-phase checks
    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      generatedPlan = JSON.parse(cleanedContent);
      console.log('✅ Parsed plan structure with life-phase validation');
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'AI response format error',
        details: 'Unable to process AI response. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced validation with life-phase checks
    try {
      validateMealPlan(generatedPlan, includeSnacks);
      
      // NEW: Life-phase specific validation
      if (!validateLifePhaseMealPlan(generatedPlan, nutritionContext)) {
        throw new Error('Life-phase nutrition requirements not met');
      }
      
      console.log(`✅ VALIDATION PASSED - Life-phase meal plan for ${language}`);
    } catch (validationError) {
      console.error('❌ Meal plan validation failed:', validationError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Generated plan validation failed',
        details: `Plan validation failed: ${validationError.message}. Please try again.`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Decrement AI generations BEFORE saving
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);

    // Save to database with enhanced logging
    console.log('💾 SAVING ENHANCED LIFE-PHASE MEAL PLAN TO DATABASE...');
    
    let weeklyPlan;
    try {
      // Add language info to preferences for storage
      const enhancedPreferencesForStorage = {
        ...preferences,
        generatedLanguage: language,
        nutritionContext: nutritionContext,
        lifePhaseTags: {
          fasting: nutritionContext.fastingType,
          pregnancy: nutritionContext.pregnancyTrimester,
          breastfeeding: nutritionContext.breastfeedingLevel,
          extraCalories: nutritionContext.extraCalories
        }
      };
      
      weeklyPlan = await saveWeeklyPlan(userProfile, generatedPlan, enhancedPreferencesForStorage, adjustedDailyCalories);
      console.log('✅ Life-phase weekly plan saved with ID:', weeklyPlan.id);
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

    console.log(`✅ ENHANCED LIFE-PHASE GENERATION COMPLETE:`, {
      totalMealsSaved,
      remainingGenerations,
      language,
      isArabic,
      includeSnacks,
      nutritionContext
    });
    console.log('=== ENHANCED MEAL PLAN GENERATION WITH LIFE-PHASE SUPPORT END ===');
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: remainingGenerations,
      includeSnacks: includeSnacks,
      weekOffset: preferences?.weekOffset || 0,
      language: language,
      nutritionContext: nutritionContext,
      message: `✨ ${isArabic ? 'تم إنشاء خطة وجبات محسّنة لمرحلة الحياة مع' : 'Life-phase optimized meal plan generated with'} ${totalMealsSaved} ${isArabic ? 'وجبة' : 'meals'}${nutritionContext.extraCalories > 0 ? ` (+${nutritionContext.extraCalories} kcal)` : ''}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== ENHANCED LIFE-PHASE MEAL PLAN GENERATION FAILED ===');
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
