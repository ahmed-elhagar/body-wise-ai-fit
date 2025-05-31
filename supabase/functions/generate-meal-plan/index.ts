
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateDailyCalories, calculateLifePhaseAdjustments } from './nutritionCalculator.ts';
import { generateMealPlanPrompt } from './promptGenerator.ts';
import { validateMealPlan, validateLifePhaseMealPlan } from './mealPlanValidator.ts';
import { saveWeeklyPlan } from './weeklyPlanStorage.ts';
import { saveMealsToDatabase } from './mealStorage.ts';
import { buildNutritionContext, enhancePromptWithLifePhase } from './lifePhaseProcessor.ts';
import { optimizedDatabaseOperations } from './databaseOptimization.ts';
import { handleMealPlanError, createUserFriendlyError, errorCodes, MealPlanError } from './enhancedErrorHandling.ts';
import { enhancedRateLimiting } from './rateLimitingEnhanced.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { userProfile, preferences } = await parseAndValidateRequest(req);
    language = preferences?.language || userProfile?.preferred_language || 'en';
    
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new MealPlanError(
        'OpenAI API key not configured',
        errorCodes.AI_GENERATION_FAILED,
        500
      );
    }

    console.log('🌐 Language Configuration:', { language });

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
      { userProfile, preferences, language }
    );

    // Build nutrition context
    const nutritionContext = buildNutritionContext(userProfile);
    console.log('🏥 Life-Phase Context:', nutritionContext);

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
    
    // Generate AI meal plan with caching
    const generatedPlan = await generateAIMealPlanWithCaching(
      userProfile,
      preferences,
      adjustedDailyCalories,
      includeSnacks,
      language,
      nutritionContext,
      openAIApiKey
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
      { ...preferences, nutritionContext, language }, 
      adjustedDailyCalories
    );
    
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);

    // Complete generation log as successful
    if (logId) {
      await enhancedRateLimiting.completeGeneration(logId, true, {
        weeklyPlanId: weeklyPlan.id,
        totalMeals: totalMealsSaved,
        nutritionContext
      });
    }

    console.log('✅ ENHANCED GENERATION COMPLETE:', {
      totalMealsSaved,
      remainingCredits: rateLimitResult.remaining - (rateLimitResult.isPro ? 0 : 1),
      language,
      nutritionContext
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: rateLimitResult.isPro ? -1 : rateLimitResult.remaining - 1,
      includeSnacks,
      weekOffset: preferences?.weekOffset || 0,
      language,
      nutritionContext,
      isPro: rateLimitResult.isPro,
      message: `✨ Meal plan generated with ${totalMealsSaved} meals${lifePhaseAdjustments > 0 ? ` (+${lifePhaseAdjustments} kcal)` : ''}`
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

const parseAndValidateRequest = async (req: Request) => {
  try {
    const body = await req.json();
    const { userProfile, preferences } = body;
    
    if (!userProfile?.id) {
      throw new MealPlanError(
        'User profile is required',
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
    
    return { userProfile, preferences };
  } catch (error) {
    if (error instanceof MealPlanError) throw error;
    
    throw new MealPlanError(
      'Invalid request format',
      errorCodes.VALIDATION_ERROR,
      400,
      true
    );
  }
};

const generateAIMealPlanWithCaching = async (
  userProfile: any,
  preferences: any,
  adjustedDailyCalories: number,
  includeSnacks: boolean,
  language: string,
  nutritionContext: any,
  openAIApiKey: string
) => {
  const systemPrompt = language === 'ar' 
    ? 'أنت خبير تغذية مُحترف بالذكاء الاصطناعي متخصص في التغذية لمراحل الحياة المختلفة.'
    : 'You are a professional nutritionist AI specialized in life-phase nutrition.';

  const basePrompt = generateMealPlanPrompt(userProfile, preferences, adjustedDailyCalories, includeSnacks);
  const enhancedPrompt = enhancePromptWithLifePhase(basePrompt, nutritionContext, language);

  console.log('🤖 Sending enhanced request to OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

  if (!response.ok) {
    if (response.status === 429) {
      throw createUserFriendlyError(errorCodes.OPENAI_API_ERROR, language);
    }
    throw new MealPlanError(
      'AI generation failed',
      errorCodes.AI_GENERATION_FAILED,
      response.status,
      true
    );
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new MealPlanError(
      'Invalid AI response',
      errorCodes.AI_GENERATION_FAILED,
      500,
      true
    );
  }

  // Parse and clean response with enhanced validation
  const content = data.choices[0].message.content.trim();
  const cleanedContent = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    const parsedPlan = JSON.parse(cleanedContent);
    
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
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    throw new MealPlanError(
      'Invalid AI response format',
      errorCodes.AI_GENERATION_FAILED,
      500,
      true
    );
  }
};
