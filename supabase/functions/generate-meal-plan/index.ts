
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

    console.log('=== OPTIMIZED MEAL PLAN GENERATION START ===');
    console.log('User Profile:', JSON.stringify(userProfile, null, 2));
    console.log('Preferences:', JSON.stringify(preferences, null, 2));

    // Check generations and get profile data
    const profileData = await checkAndDecrementGenerations(userProfile);
    
    // Calculate daily calorie needs
    const dailyCalories = calculateDailyCalories(userProfile);
    console.log('Calculated daily calories:', dailyCalories);

    // Calculate number of meals based on snacks preference
    const includeSnacks = preferences.includeSnacks !== false;
    const mealsPerDay = includeSnacks ? 5 : 3;
    const totalMeals = mealsPerDay * 7;
    
    console.log(`Generating ${totalMeals} meals (${mealsPerDay} meals/day, snacks: ${includeSnacks})`);

    // Generate optimized AI prompt
    const prompt = generateMealPlanPrompt(userProfile, preferences, dailyCalories, includeSnacks);

    console.log('Sending OPTIMIZED request to OpenAI...');
    
    // PERFORMANCE OPTIMIZATION: Use faster model with optimized settings
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fastest model for production
        messages: [
          { 
            role: 'system', 
            content: `You are a professional nutritionist. Generate EXACTLY 7 days starting from SATURDAY with ${includeSnacks ? 'EXACTLY 5 meals each (35 total)' : 'EXACTLY 3 meals each (21 total)'}. Return ONLY valid JSON - no markdown. Focus on ${userProfile?.nationality || 'international'} cuisine with realistic prep times ≤${preferences?.maxPrepTime || 45} minutes.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2, // Lower for consistency and speed
        max_tokens: 8000, // Reduced for faster response
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false // Ensure non-streaming for reliability
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received in optimized time');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse and clean the response with improved error handling
    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      
      // Clean JSON response more efficiently
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
      console.log('✅ Meal plan parsed successfully');
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Quick validation
    validateMealPlan(generatedPlan, includeSnacks);
    console.log(`✅ VALIDATION PASSED - 7 days with ${totalMeals} total meals`);
    
    // Decrement AI generations BEFORE saving
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);

    // Save to database efficiently
    console.log('Saving meal plan to database...');
    const weeklyPlan = await saveWeeklyPlan(userProfile, generatedPlan, preferences, dailyCalories);
    
    // Save meals with background processing for images
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);

    console.log(`✅ OPTIMIZED GENERATION COMPLETE: ${totalMealsSaved} meals in reduced time`);
    console.log(`✅ AI generations remaining: ${remainingGenerations}`);
    
    return new Response(JSON.stringify({ 
      success: true,
      weeklyPlanId: weeklyPlan.id,
      totalMeals: totalMealsSaved,
      generationsRemaining: remainingGenerations,
      includeSnacks: includeSnacks,
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
