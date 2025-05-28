
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

    // Calculate BMR and daily calorie needs
    const bmr = userProfile?.gender === 'male' 
      ? 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)
      : 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);

    const activityMultiplier = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extremely_active': 1.9
    }[userProfile?.activity_level] || 1.55;

    const dailyCalories = Math.round(bmr * activityMultiplier);

    // Enhanced structured prompt for better AI response
    const prompt = `You are a professional nutritionist creating a personalized meal plan. Generate a complete 7-day meal plan with the following specifications:

USER PROFILE:
- Age: ${userProfile?.age} years old
- Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Fitness Goal: ${userProfile?.fitness_goal}
- Activity Level: ${userProfile?.activity_level}
- Nationality: ${userProfile?.nationality}
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}
- Preferred Foods: ${userProfile?.preferred_foods?.join(', ') || 'Various'}

REQUIREMENTS:
- Target daily calories: ${dailyCalories}
- Cultural preferences based on ${userProfile?.nationality} cuisine
- 5 meals per day: breakfast, lunch, dinner, snack1, snack2
- Include detailed nutritional information
- Provide cooking instructions and prep times
- Include YouTube search terms for cooking videos
- Generate shopping list items
- Provide meal alternatives for variety

RESPONSE FORMAT - Return ONLY valid JSON in this exact structure:
{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 0,
    "totalCarbs": 0,
    "totalFat": 0
  },
  "shoppingList": [
    {"item": "ingredient name", "quantity": "amount", "unit": "unit", "category": "category"}
  ],
  "exchangeList": [
    {"food": "original food", "alternatives": ["alt1", "alt2"], "reason": "explanation"}
  ],
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "ingredients": [{"name": "ingredient", "quantity": "1", "unit": "cup"}],
          "instructions": ["Step 1", "Step 2"],
          "prepTime": 15,
          "cookTime": 10,
          "servings": 1,
          "youtubeSearchTerm": "healthy breakfast recipe",
          "alternatives": ["Alternative meal 1", "Alternative meal 2"]
        }
      ]
    }
  ]
}

Ensure all nutritional values sum correctly and meals align with cultural preferences.`;

    console.log('Sending request to OpenAI with enhanced prompt');
    
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
            content: 'You are an expert nutritionist and meal planner. Always respond with valid JSON only. Be precise with nutritional calculations and culturally appropriate meal suggestions. Ensure all JSON is properly formatted and complete.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedPlan;
    try {
      const content = data.choices[0].message.content;
      // Clean the response to ensure it's valid JSON
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Validate the generated plan structure
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
      throw new Error('Invalid meal plan structure received from AI');
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
