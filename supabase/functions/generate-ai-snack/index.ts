
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, dayNumber, currentMeals, remainingCalories, weeklyPlanId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating AI snack for day', dayNumber, 'with remaining calories:', remainingCalories);

    // Calculate target calories for snack (should be reasonable portion of remaining calories)
    const targetCalories = Math.min(Math.max(remainingCalories * 0.3, 80), 250);

    const prompt = `Generate a healthy snack that fits within ${targetCalories} calories (±20 calories) for a ${userProfile?.nationality || 'international'} person.

USER PROFILE:
- Nationality: ${userProfile?.nationality || 'International'}
- Fitness Goal: ${userProfile?.fitness_goal || 'balanced nutrition'}
- Activity Level: ${userProfile?.activity_level || 'moderate'}

CONSTRAINTS:
- Target calories: ${Math.round(targetCalories)} (must be between ${Math.round(targetCalories - 20)} and ${Math.round(targetCalories + 20)})
- Must be quick to prepare (under 10 minutes)
- Healthy and nutritious
- Culturally appropriate for ${userProfile?.nationality || 'international'} cuisine

Return ONLY valid JSON with this exact structure:
{
  "name": "Snack name",
  "calories": ${Math.round(targetCalories)},
  "protein": 8,
  "carbs": 15,
  "fat": 5,
  "fiber": 3,
  "sugar": 8,
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "unit", "calories": 50, "protein": 2, "carbs": 8, "fat": 1}
  ],
  "instructions": ["step 1", "step 2"],
  "prepTime": 5,
  "cookTime": 0,
  "servings": 1,
  "description": "Brief description of the snack"
}`;

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
            content: 'You are a nutritionist AI. Generate healthy snacks that fit specific calorie targets. Return ONLY valid JSON without markdown formatting.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean the content
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let snackData;
    try {
      snackData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    // Validate the generated snack
    if (!snackData.name || !snackData.calories) {
      throw new Error('Invalid snack data generated');
    }

    // Save the snack to the database
    const { data: savedSnack, error: saveError } = await supabase
      .from('daily_meals')
      .insert({
        weekly_plan_id: weeklyPlanId,
        day_number: dayNumber,
        meal_type: 'snack',
        name: snackData.name,
        calories: snackData.calories || 0,
        protein: snackData.protein || 0,
        carbs: snackData.carbs || 0,
        fat: snackData.fat || 0,
        ingredients: snackData.ingredients || [],
        instructions: snackData.instructions || [],
        prep_time: snackData.prepTime || 5,
        cook_time: snackData.cookTime || 0,
        servings: snackData.servings || 1
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving snack:', saveError);
      throw new Error('Failed to save snack to database');
    }

    console.log('AI snack generated and saved successfully:', snackData.name);

    return new Response(JSON.stringify({ 
      snack: snackData,
      savedSnack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-snack:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate AI snack' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
