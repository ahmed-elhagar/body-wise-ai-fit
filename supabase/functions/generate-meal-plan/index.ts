
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    const prompt = `Generate a personalized 7-day meal plan for a ${userProfile.age} year old ${userProfile.gender} with the following details:
    - Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
    - Fitness Goal: ${userProfile.fitness_goal}
    - Activity Level: ${userProfile.activity_level}
    - Body Shape: ${userProfile.body_shape}
    - Allergies: ${userProfile.allergies?.join(', ') || 'None'}
    - Dietary Restrictions: ${userProfile.dietary_restrictions?.join(', ') || 'None'}
    - Preferred Foods: ${userProfile.preferred_foods?.join(', ') || 'Various'}
    - Nationality: ${userProfile.nationality}

    Create a comprehensive meal plan with breakfast, lunch, dinner, and 2 snacks for each day. Include:
    - Exact calorie counts per meal
    - Macro breakdown (protein, carbs, fat in grams)
    - Detailed ingredient lists
    - Cooking instructions
    - Prep and cook times
    - Cultural preferences based on nationality

    Format as JSON with this structure:
    {
      "weekSummary": {
        "totalCalories": number,
        "avgDailyCalories": number,
        "totalProtein": number,
        "totalCarbs": number,
        "totalFat": number
      },
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Monday",
          "totalCalories": number,
          "meals": [
            {
              "type": "breakfast",
              "name": "meal name",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "ingredients": ["ingredient1", "ingredient2"],
              "instructions": "step by step cooking instructions",
              "prepTime": number,
              "cookTime": number,
              "servings": 1
            }
          ]
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
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional nutritionist and meal planning expert. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedPlan = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ generatedPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
