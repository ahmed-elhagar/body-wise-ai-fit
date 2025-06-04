
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Helper function to clean and parse JSON from OpenAI response
function cleanAndParseJSON(content: string): any {
  try {
    // Remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/\s*```$/g, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\s*/g, '').replace(/\s*```$/g, '');
    }
    
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('❌ Failed to parse JSON content:', content);
    throw new Error('Invalid JSON response from AI');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { mealId, reason, preferences, action = 'generate_alternatives', alternative } = await req.json();

    console.log(`🔄 Processing meal exchange action: ${action} for meal ${mealId}`);

    // Get the current meal
    const { data: currentMeal, error: mealError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('id', mealId)
      .single();

    if (mealError || !currentMeal) {
      throw new Error('Meal not found');
    }

    switch (action) {
      case 'generate_alternatives':
        return await generateAlternatives(currentMeal, reason, preferences);
      
      case 'exchange_meal':
        return await exchangeMealWithAlternative(supabase, mealId, alternative);
      
      case 'quick_exchange':
        return await quickExchangeMeal(supabase, currentMeal, reason);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('❌ Error in meal exchange function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process meal exchange' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateAlternatives(currentMeal: any, reason: string, preferences: any = {}) {
  const prompt = `Generate 3-5 alternative meals for this current meal. Return ONLY a valid JSON array, no markdown formatting.

Current Meal: ${currentMeal.name}
Calories: ${currentMeal.calories}
Protein: ${currentMeal.protein}g
Carbs: ${currentMeal.carbs}g  
Fat: ${currentMeal.fat}g
Prep/Cook Time: ${(currentMeal.prep_time || 0) + (currentMeal.cook_time || 0)} minutes
Meal Type: ${currentMeal.meal_type}

Exchange Reason: ${reason}
Preferences: ${JSON.stringify(preferences)}

Requirements:
- Similar caloric content (±150 calories)
- Similar macronutrient profile (±20% variation)
- Same meal type (${currentMeal.meal_type})
- Respect prep time preferences
- Provide variety and appeal

For each alternative, provide exactly this structure:
{
  "name": "descriptive meal name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "prep_time": number,
  "cook_time": number,
  "servings": number,
  "similarity_score": number between 0-1,
  "reason": "why this is a good alternative",
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "instructions": ["step 1", "step 2", "step 3"]
}

Return as a JSON array of 3-5 alternatives. Do not include any markdown formatting or explanatory text.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a nutrition expert and meal planning assistant. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  let alternatives;
  try {
    alternatives = cleanAndParseJSON(data.choices[0].message.content);
  } catch (parseError) {
    console.error('❌ Raw OpenAI response:', data.choices[0].message.content);
    throw new Error('Failed to generate valid alternatives');
  }

  if (!Array.isArray(alternatives)) {
    throw new Error('Invalid alternatives format - expected array');
  }

  console.log(`✅ Generated ${alternatives.length} alternatives`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      alternatives: alternatives.map((alt, index) => ({ ...alt, id: `alt-${index}` }))
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function exchangeMealWithAlternative(supabase: any, mealId: string, alternative: any) {
  console.log('🔄 Exchanging meal with selected alternative');

  const updateData = {
    name: alternative.name,
    calories: alternative.calories,
    protein: alternative.protein,
    carbs: alternative.carbs,
    fat: alternative.fat,
    prep_time: alternative.prep_time,
    cook_time: alternative.cook_time,
    servings: alternative.servings,
    ingredients: alternative.ingredients,
    instructions: alternative.instructions,
  };

  const { error } = await supabase
    .from('daily_meals')
    .update(updateData)
    .eq('id', mealId);

  if (error) {
    throw new Error('Failed to update meal in database');
  }

  console.log('✅ Meal exchanged successfully');

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function quickExchangeMeal(supabase: any, currentMeal: any, reason: string) {
  const prompt = `Generate 1 alternative meal to replace this current meal. Return ONLY a valid JSON object, no markdown formatting.

Current Meal: ${currentMeal.name}
Calories: ${currentMeal.calories}
Protein: ${currentMeal.protein}g
Carbs: ${currentMeal.carbs}g  
Fat: ${currentMeal.fat}g
Meal Type: ${currentMeal.meal_type}
Exchange Reason: ${reason}

Requirements:
- Similar caloric content (±100 calories)
- Similar macronutrient profile (±15% variation)
- Same meal type
- Address the exchange reason effectively

Provide exactly this structure:
{
  "name": "meal name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "prep_time": number,
  "cook_time": number,
  "servings": number,
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "instructions": ["step 1", "step 2", "step 3"]
}

Return as JSON object (not array). Do not include any markdown formatting.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a nutrition expert. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  let newMeal;
  try {
    newMeal = cleanAndParseJSON(data.choices[0].message.content);
  } catch (parseError) {
    console.error('❌ Raw OpenAI response:', data.choices[0].message.content);
    throw new Error('Failed to generate valid meal');
  }

  // Update the meal in the database
  const updateData = {
    name: newMeal.name,
    calories: newMeal.calories,
    protein: newMeal.protein,
    carbs: newMeal.carbs,
    fat: newMeal.fat,
    prep_time: newMeal.prep_time,
    cook_time: newMeal.cook_time,
    servings: newMeal.servings,
    ingredients: newMeal.ingredients,
    instructions: newMeal.instructions,
  };

  const { error } = await supabase
    .from('daily_meals')
    .update(updateData)
    .eq('id', currentMeal.id);

  if (error) {
    throw new Error('Failed to update meal in database');
  }

  console.log('✅ Generated and saved quick exchange meal:', newMeal.name);

  return new Response(
    JSON.stringify({ 
      success: true, 
      meal: { ...newMeal, id: currentMeal.id }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
