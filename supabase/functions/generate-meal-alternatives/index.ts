
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

IMPORTANT: Return ONLY valid JSON without markdown formatting. Generate alternatives with similar nutritional values (±50 calories, similar macros) but different ingredients/cooking methods.

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
          { role: 'user', content: `Generate alternatives for this ${currentMeal.type} meal: ${currentMeal.name}` }
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
    
    try {
      const parsed = JSON.parse(content);
      console.log('Successfully parsed alternatives:', parsed.alternatives?.length || 0);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      
      // Fallback response
      const fallbackResponse = {
        alternatives: [
          {
            name: "Healthy Alternative",
            calories: currentMeal.calories || 400,
            protein: currentMeal.protein || 20,
            carbs: currentMeal.carbs || 45,
            fat: currentMeal.fat || 12,
            reason: "A nutritious alternative with similar macros",
            ingredients: [
              { name: "lean protein", quantity: "1", unit: "serving" },
              { name: "vegetables", quantity: "1", unit: "cup" },
              { name: "whole grains", quantity: "1/2", unit: "cup" }
            ],
            instructions: ["Prepare ingredients", "Cook as desired", "Serve hot"],
            prepTime: 10,
            cookTime: 15,
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
