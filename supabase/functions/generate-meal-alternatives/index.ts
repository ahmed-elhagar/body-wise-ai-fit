
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentMeal, userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating meal alternatives for:', currentMeal.name);

    const systemMessage = `You are a nutritionist AI that generates healthy meal alternatives. Create 3-4 alternative meals that are similar in calories and nutritional profile to the current meal.

CURRENT MEAL:
- Name: ${currentMeal.name}
- Calories: ${currentMeal.calories}
- Protein: ${currentMeal.protein}g
- Carbs: ${currentMeal.carbs}g
- Fat: ${currentMeal.fat}g
- Type: ${currentMeal.type}

USER PREFERENCES:
- Dietary restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
- Allergies: ${preferences.allergies?.join(', ') || 'None'}
- Preferred foods: ${preferences.preferredFoods?.join(', ') || 'None'}
- Nationality: ${userProfile.nationality || 'International'}

CRITICAL: Return ONLY valid JSON without markdown formatting. All numeric values must be numbers (not strings with "g" suffix).

Return this exact JSON structure:
{
  "alternatives": [
    {
      "name": "Alternative meal name",
      "calories": 450,
      "protein": 25,
      "carbs": 40,
      "fat": 15,
      "reason": "Why this is a good alternative",
      "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
      "instructions": ["step 1", "step 2"],
      "prepTime": 10,
      "cookTime": 15,
      "servings": 1
    }
  ]
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
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Generate alternatives for this ${currentMeal.type} meal: ${currentMeal.name}. Remember: return only valid JSON with numeric values (no "g" suffixes).` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Fix common JSON issues - remove "g" suffixes from numeric values
    content = content.replace(/"protein":\s*"?(\d+)g?"?,/g, '"protein": $1,');
    content = content.replace(/"carbs":\s*"?(\d+)g?"?,/g, '"carbs": $1,');
    content = content.replace(/"fat":\s*"?(\d+)g?"?,/g, '"fat": $1,');
    
    try {
      const parsed = JSON.parse(content);
      
      // Validate the structure
      if (!parsed.alternatives || !Array.isArray(parsed.alternatives)) {
        throw new Error('Invalid response structure');
      }
      
      // Ensure all alternatives have required fields
      const validatedAlternatives = parsed.alternatives.map((alt: any) => ({
        name: alt.name || 'Healthy Alternative',
        calories: typeof alt.calories === 'number' ? alt.calories : parseInt(alt.calories) || currentMeal.calories,
        protein: typeof alt.protein === 'number' ? alt.protein : parseInt(alt.protein) || currentMeal.protein,
        carbs: typeof alt.carbs === 'number' ? alt.carbs : parseInt(alt.carbs) || currentMeal.carbs,
        fat: typeof alt.fat === 'number' ? alt.fat : parseInt(alt.fat) || currentMeal.fat,
        reason: alt.reason || 'A nutritious alternative with similar macros',
        ingredients: Array.isArray(alt.ingredients) ? alt.ingredients : [
          { name: "lean protein", quantity: "1", unit: "serving" },
          { name: "vegetables", quantity: "1", unit: "cup" },
          { name: "whole grains", quantity: "1/2", unit: "cup" }
        ],
        instructions: Array.isArray(alt.instructions) ? alt.instructions : [
          "Prepare ingredients according to recipe",
          "Cook as desired",
          "Serve hot and enjoy"
        ],
        prepTime: alt.prepTime || 10,
        cookTime: alt.cookTime || 15,
        servings: alt.servings || 1
      }));
      
      console.log('Successfully parsed alternatives:', validatedAlternatives.length);
      return new Response(JSON.stringify({ alternatives: validatedAlternatives }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      
      // Fallback response with properly structured alternatives
      const fallbackResponse = {
        alternatives: [
          {
            name: `Healthy ${currentMeal.type} Alternative`,
            calories: currentMeal.calories || 400,
            protein: currentMeal.protein || 20,
            carbs: currentMeal.carbs || 45,
            fat: currentMeal.fat || 12,
            reason: "A nutritious alternative with similar macronutrients",
            ingredients: [
              { name: "lean protein source", quantity: "1", unit: "serving" },
              { name: "fresh vegetables", quantity: "1", unit: "cup" },
              { name: "whole grain", quantity: "1/2", unit: "cup" }
            ],
            instructions: [
              "Prepare all ingredients",
              "Cook protein and vegetables",
              "Serve with whole grain",
              "Season to taste"
            ],
            prepTime: 10,
            cookTime: 15,
            servings: 1
          },
          {
            name: `Mediterranean ${currentMeal.type}`,
            calories: Math.round(currentMeal.calories * 0.95) || 380,
            protein: currentMeal.protein || 18,
            carbs: currentMeal.carbs || 42,
            fat: currentMeal.fat || 14,
            reason: "Mediterranean-inspired alternative with healthy fats",
            ingredients: [
              { name: "olive oil", quantity: "1", unit: "tbsp" },
              { name: "fresh herbs", quantity: "2", unit: "tbsp" },
              { name: "lean protein", quantity: "1", unit: "serving" }
            ],
            instructions: [
              "Heat olive oil in pan",
              "Add protein and cook",
              "Garnish with fresh herbs",
              "Serve immediately"
            ],
            prepTime: 8,
            cookTime: 12,
            servings: 1
          }
        ]
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-meal-alternatives:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal alternatives' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
