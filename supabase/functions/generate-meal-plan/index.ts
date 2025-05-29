
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
    const { userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('=== MEAL PLAN GENERATION DEBUG START ===');
    console.log('User Profile:', JSON.stringify(userProfile, null, 2));
    console.log('Preferences:', JSON.stringify(preferences, null, 2));
    console.log('Week Offset from request:', preferences?.weekOffset || 0);

    // Check generations and get profile data
    const profileData = await checkAndDecrementGenerations(userProfile);
    
    // Calculate daily calorie needs
    const dailyCalories = calculateDailyCalories(userProfile);
    console.log('Calculated daily calories:', dailyCalories);

    // Get includeSnacks from preferences
    const includeSnacks = preferences?.includeSnacks !== false && preferences?.includeSnacks !== 'false';
    const mealsPerDay = includeSnacks ? 5 : 3;
    const totalMeals = mealsPerDay * 7;
    
    console.log(`🍽️ GENERATION CONFIG: includeSnacks=${includeSnacks} (from preferences: ${preferences?.includeSnacks})`);
    console.log(`Generating ${totalMeals} meals (${mealsPerDay} meals/day, snacks: ${includeSnacks})`);

    // Generate AI prompt
    const prompt = generateMealPlanPrompt(userProfile, preferences, dailyCalories, includeSnacks);

    console.log('Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a professional nutritionist. Generate EXACTLY 7 days starting from SATURDAY with ${includeSnacks ? 'EXACTLY 5 meals each (35 total)' : 'EXACTLY 3 meals each (21 total)'}. Return ONLY valid JSON - no markdown. Focus on ${userProfile?.nationality || 'international'} cuisine with realistic prep times ≤${preferences?.maxPrepTime || 45} minutes.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 8000,
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse and clean the response
    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      console.log('Raw OpenAI content:', content.substring(0, 500) + '...');
      
      // Clean JSON response
      let cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
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
        weekSummary: !!generatedPlan.weekSummary
      });
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Content that failed to parse:', content);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Validate the meal plan
    validateMealPlan(generatedPlan, includeSnacks);
    console.log(`✅ VALIDATION PASSED - 7 days with ${totalMeals} total meals`);
    
    // Decrement AI generations BEFORE saving
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);

    // Save to database with detailed logging
    console.log('📊 SAVING TO DATABASE...');
    console.log('Week offset for saving:', preferences?.weekOffset || 0);
    
    const weeklyPlan = await saveWeeklyPlan(userProfile, generatedPlan, preferences, dailyCalories);
    console.log('✅ Weekly plan saved with ID:', weeklyPlan.id);
    
    // Save individual meals
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);
    console.log('✅ Individual meals saved:', totalMealsSaved);

    console.log(`✅ GENERATION COMPLETE: ${totalMealsSaved} meals saved`);
    console.log(`✅ AI generations remaining: ${remainingGenerations}`);
    console.log('=== MEAL PLAN GENERATION DEBUG END ===');
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      totalMeals: totalMealsSaved,
      generationsRemaining: remainingGenerations,
      includeSnacks: includeSnacks,
      weekOffset: preferences?.weekOffset || 0,
      message: `✨ Optimized meal plan generated with ${totalMealsSaved} meals${includeSnacks ? ' including snacks' : ''}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===');
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
