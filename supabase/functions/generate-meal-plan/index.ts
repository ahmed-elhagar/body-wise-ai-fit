
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
    const { userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating meal plan for user:', userProfile?.id);
    console.log('Preferences:', preferences);

    // Create a comprehensive prompt for meal planning
    const prompt = `Generate a personalized 7-day meal plan for a ${userProfile?.age || 'adult'} year old ${userProfile?.gender || 'person'} with the following details:
    - Height: ${userProfile?.height || 'average'}cm, Weight: ${userProfile?.weight || 'average'}kg
    - Fitness Goal: ${userProfile?.fitness_goal || 'general health'}
    - Activity Level: ${userProfile?.activity_level || 'moderate'}
    - Body Shape: ${userProfile?.body_shape || 'average'}
    - Nationality: ${userProfile?.nationality || 'International'}
    - Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
    - Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}
    - Preferred Cuisine: ${preferences?.cuisine || 'Various'}
    - Max Prep Time: ${preferences?.maxPrepTime || '30'} minutes
    
    Create a complete 7-day meal plan with breakfast, lunch, dinner, and 2 snacks for each day. Include:
    - Calories per meal
    - Macro breakdown (protein, carbs, fat)
    - Detailed ingredient lists with quantities
    - Step-by-step cooking instructions
    - Prep and cook times
    - Cultural preferences based on nationality

    Format as JSON with this exact structure:
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
              "name": "Meal Name",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
              "instructions": ["Step 1", "Step 2"],
              "prepTime": number,
              "cookTime": number,
              "servings": 1,
              "youtubeSearchTerm": "search term for cooking video"
            }
          ]
        }
      ]
    }`;

    console.log('Sending request to OpenAI');
    
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
            content: 'You are a professional nutritionist and meal planning expert. Always respond with valid JSON only. Be precise with nutritional data and cooking instructions. Consider cultural food preferences.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a few minutes.');
      } else if (response.status === 401) {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedPlan;
    try {
      generatedPlan = JSON.parse(data.choices[0].message.content);
      console.log('Meal plan parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ generatedPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
