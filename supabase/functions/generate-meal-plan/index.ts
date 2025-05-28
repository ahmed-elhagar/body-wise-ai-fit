
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for the edge function
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    console.log('Generating enhanced meal plan for user:', userProfile?.id);

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

    // Enhanced prompt for comprehensive 7-day meal planning
    const prompt = `You are a professional nutritionist and culinary expert creating a comprehensive 7-day meal plan. Generate exactly 7 days of meals with 5 meals per day (breakfast, lunch, dinner, snack1, snack2).

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
- Target daily calories: ${dailyCalories} (distribute across 5 meals: breakfast 25%, lunch 30%, dinner 30%, snack1 8%, snack2 7%)
- Cultural preferences based on ${userProfile?.nationality} cuisine
- Provide EXACT nutritional values for each ingredient
- Include detailed cooking instructions (step-by-step)
- Prep and cook times for each meal
- YouTube search terms for cooking tutorials
- Shopping list with precise quantities
- Meal alternatives for variety
- Ensure each day has exactly 5 meals

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
    {"item": "ingredient name", "quantity": "amount with unit", "category": "produce/dairy/meat/etc"}
  ],
  "exchangeList": [
    {"food": "original food", "alternatives": ["alternative 1", "alternative 2"], "reason": "nutritional explanation"}
  ],
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Specific Meal Name",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "fiber": 0,
          "sugar": 0,
          "ingredients": [
            {"name": "ingredient name", "quantity": "1", "unit": "cup", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}
          ],
          "instructions": ["Detailed step 1", "Detailed step 2", "etc"],
          "prepTime": 15,
          "cookTime": 10,
          "servings": 1,
          "youtubeSearchTerm": "specific recipe name tutorial",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "easy/medium/hard",
          "alternatives": ["Alternative meal 1", "Alternative meal 2"]
        }
      ]
    }
  ]
}

IMPORTANT: Generate exactly 7 days (Monday through Sunday), each with exactly 5 meals. Ensure nutritional values are realistic and sum correctly. Include variety while respecting cultural preferences and dietary restrictions.`;

    console.log('Sending enhanced request to OpenAI');
    
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
            content: `You are an expert nutritionist and meal planner. Always respond with valid JSON only. Ensure exactly 7 days of meals, each day having exactly 5 meals (breakfast, lunch, dinner, snack1, snack2). Be precise with nutritional calculations and culturally appropriate meal suggestions. Each meal should be realistic and achievable.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
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
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Validate the generated plan structure
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days) || generatedPlan.days.length !== 7) {
      throw new Error('Invalid meal plan structure: Must contain exactly 7 days');
    }

    // Validate each day has 5 meals
    for (const day of generatedPlan.days) {
      if (!day.meals || !Array.isArray(day.meals) || day.meals.length !== 5) {
        throw new Error(`Day ${day.dayNumber} must have exactly 5 meals`);
      }
    }

    console.log('Starting food database population...');
    
    // Populate food database with meal data
    const foodItems = new Map(); // Use Map to avoid duplicates
    
    for (const day of generatedPlan.days) {
      for (const meal of day.meals) {
        // Add the main meal as a food item
        const mealKey = meal.name.toLowerCase();
        if (!foodItems.has(mealKey)) {
          foodItems.set(mealKey, {
            name: meal.name,
            calories_per_unit: meal.calories || 0,
            protein_per_unit: meal.protein || 0,
            carbs_per_unit: meal.carbs || 0,
            fat_per_unit: meal.fat || 0,
            fiber_per_unit: meal.fiber || 0,
            sugar_per_unit: meal.sugar || 0,
            unit_type: 'serving',
            confidence_score: 0.9,
            cuisine_type: meal.cuisine || userProfile?.nationality || 'international',
            source: 'ai_meal_plan'
          });
        }
        
        // Add individual ingredients to food database
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          for (const ingredient of meal.ingredients) {
            const ingredientKey = ingredient.name.toLowerCase();
            if (!foodItems.has(ingredientKey)) {
              foodItems.set(ingredientKey, {
                name: ingredient.name,
                calories_per_unit: ingredient.calories || 0,
                protein_per_unit: ingredient.protein || 0,
                carbs_per_unit: ingredient.carbs || 0,
                fat_per_unit: ingredient.fat || 0,
                fiber_per_unit: 0,
                sugar_per_unit: 0,
                unit_type: ingredient.unit || 'serving',
                confidence_score: 0.8,
                cuisine_type: meal.cuisine || userProfile?.nationality || 'international',
                source: 'ai_ingredient'
              });
            }
          }
        }
      }
    }

    // Insert food items into database
    if (foodItems.size > 0) {
      const foodItemsArray = Array.from(foodItems.values());
      console.log(`Inserting ${foodItemsArray.length} food items into database`);
      
      const { error: foodError } = await supabase
        .from('food_database')
        .upsert(foodItemsArray, { 
          onConflict: 'name',
          ignoreDuplicates: true 
        });

      if (foodError) {
        console.error('Error inserting food items:', foodError);
      } else {
        console.log('Food database populated successfully');
      }
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
