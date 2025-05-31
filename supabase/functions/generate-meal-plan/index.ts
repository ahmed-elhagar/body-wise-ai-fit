
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateDailyCalories, calculateLifePhaseAdjustments } from './nutritionCalculator.ts';
import { generateMealPlanPrompt } from './promptGenerator.ts';
import { validateMealPlan, validateLifePhaseMealPlan } from './mealPlanValidator.ts';
import { 
  checkAndDecrementGenerations, 
  saveWeeklyPlan, 
  saveMealsToDatabase, 
  decrementUserGenerations 
} from './databaseOperations.ts';
import { 
  buildNutritionContext, 
  enhancePromptWithLifePhase
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
    console.log('=== ENHANCED MEAL PLAN GENERATION START ===');
    
    // Parse and validate request
    const { userProfile, preferences } = await parseRequest(req);
    
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced language detection
    const language = preferences?.language || userProfile?.preferred_language || 'en';
    console.log('🌐 Language Configuration:', { language });

    // Build life-phase nutrition context
    const nutritionContext = buildNutritionContext(userProfile);
    console.log('🏥 Life-Phase Context:', nutritionContext);

    // Check user generations and get profile
    const profileData = await checkAndDecrementGenerations(userProfile);
    
    // Calculate calories with life-phase adjustments
    const baseDailyCalories = calculateDailyCalories(userProfile);
    const lifePhaseAdjustments = calculateLifePhaseAdjustments(userProfile);
    const adjustedDailyCalories = baseDailyCalories + lifePhaseAdjustments;
    
    console.log('🔥 Calorie calculation:', {
      base: baseDailyCalories,
      adjustment: lifePhaseAdjustments,
      total: adjustedDailyCalories
    });

    const includeSnacks = preferences?.includeSnacks !== false && preferences?.includeSnacks !== 'false';
    const totalMeals = (includeSnacks ? 5 : 3) * 7;
    
    // Generate AI meal plan
    const generatedPlan = await generateAIMealPlan(
      userProfile,
      preferences,
      adjustedDailyCalories,
      includeSnacks,
      language,
      nutritionContext,
      openAIApiKey
    );

    // Validate generated plan
    validateMealPlan(generatedPlan, includeSnacks);
    
    if (!validateLifePhaseMealPlan(generatedPlan, nutritionContext)) {
      throw new Error('Life-phase nutrition requirements not met');
    }

    // Decrement generations and save to database
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);
    
    const weeklyPlan = await saveWeeklyPlan(
      userProfile, 
      generatedPlan, 
      { ...preferences, nutritionContext, language }, 
      adjustedDailyCalories
    );
    
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);

    console.log('✅ GENERATION COMPLETE:', {
      totalMealsSaved,
      remainingGenerations,
      language,
      nutritionContext
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: remainingGenerations,
      includeSnacks,
      weekOffset: preferences?.weekOffset || 0,
      language,
      nutritionContext,
      message: `✨ Meal plan generated with ${totalMealsSaved} meals${lifePhaseAdjustments > 0 ? ` (+${lifePhaseAdjustments} kcal)` : ''}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===', error);
    return handleError(error);
  }
});

const parseRequest = async (req: Request) => {
  try {
    const body = await req.json();
    const { userProfile, preferences } = body;
    
    if (!userProfile?.id) {
      throw new Error('User profile is required');
    }
    
    return { userProfile, preferences };
  } catch (error) {
    throw new Error('Invalid request format');
  }
};

const generateAIMealPlan = async (
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

  console.log('🤖 Sending request to OpenAI...');
  
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
      throw new Error('Service temporarily overloaded');
    }
    throw new Error('AI generation failed');
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid AI response');
  }

  // Parse and clean response
  const content = data.choices[0].message.content.trim();
  const cleanedContent = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  return JSON.parse(cleanedContent);
};

const handleError = (error: any) => {
  const errorMessage = error.message || 'Unexpected server error';
  const status = error.message?.includes('overloaded') ? 429 : 500;
  
  return new Response(JSON.stringify({ 
    success: false,
    error: errorMessage,
    details: `An error occurred: ${errorMessage}. Please try again later.`
  }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};
