
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

    console.log('=== MEAL PLAN GENERATION START ===');
    console.log('User Profile:', JSON.stringify(userProfile, null, 2));
    console.log('Preferences:', JSON.stringify(preferences, null, 2));

    // Check generations and get profile data
    const profileData = await checkAndDecrementGenerations(userProfile);
    
    // Calculate daily calorie needs
    const dailyCalories = calculateDailyCalories(userProfile);
    console.log('Calculated daily calories:', dailyCalories);

    // Generate AI prompt
    const prompt = generateMealPlanPrompt(userProfile, preferences, dailyCalories);

    console.log('Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `You are a professional nutritionist specializing in ${userProfile?.nationality || 'international'} cuisine. Generate EXACTLY 7 days starting from SATURDAY with EXACTLY 5 meals each (35 total meals). Return ONLY valid JSON with no markdown formatting. Focus on authentic cultural dishes with detailed instructions and nutritional information.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, content length:', data.choices[0]?.message?.content?.length);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse and clean the response
    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      console.log('Raw content preview:', content.substring(0, 300) + '...');
      
      let cleanedContent = content;
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const firstBrace = cleanedContent.indexOf('{');
      if (firstBrace > 0) {
        cleanedContent = cleanedContent.substring(firstBrace);
      }
      
      const lastBrace = cleanedContent.lastIndexOf('}');
      if (lastBrace < cleanedContent.length - 1) {
        cleanedContent = cleanedContent.substring(0, lastBrace + 1);
      }
      
      console.log('Cleaned content preview:', cleanedContent.substring(0, 300) + '...');
      
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. The response was not valid JSON.');
    }

    // Validate the meal plan
    validateMealPlan(generatedPlan);
    console.log('✅ VALIDATION PASSED - 7 days with 35 total meals confirmed');
    
    // Decrement AI generations BEFORE saving
    const remainingGenerations = await decrementUserGenerations(userProfile, profileData);

    // Save weekly plan to database
    console.log('Saving new weekly plan...');
    const weeklyPlan = await saveWeeklyPlan(userProfile, generatedPlan, preferences, dailyCalories);
    console.log('Weekly plan saved with ID:', weeklyPlan.id);

    // Save all meals with images
    const { totalMealsSaved } = await saveMealsToDatabase(generatedPlan, weeklyPlan.id);

    console.log(`✅ AI generations remaining: ${remainingGenerations}`);
    console.log('=== MEAL PLAN GENERATION COMPLETE ===');
    console.log(`✅ SUCCESS: Generated ${generatedPlan.days.length} days with ${totalMealsSaved} meals`);
    
    return new Response(JSON.stringify({ 
      generatedPlan,
      generationsRemaining: remainingGenerations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===');
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
