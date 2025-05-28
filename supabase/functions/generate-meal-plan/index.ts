
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

    // Enhanced prompt with strict formatting requirements
    const prompt = `Create a comprehensive 7-day meal plan. You MUST generate exactly 7 days (Monday through Sunday), each with exactly 5 meals (breakfast, lunch, dinner, snack1, snack2).

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${userProfile?.nationality}
- Health: ${userProfile?.health_conditions?.join(', ') || 'None'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}
- Preferences: ${userProfile?.preferred_foods?.join(', ') || 'Various'}

TARGET: ${dailyCalories} calories daily (breakfast 25%, lunch 30%, dinner 30%, snack1 8%, snack2 7%)

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days (Monday=1, Tuesday=2, ..., Sunday=7)
2. EXACTLY 5 meals per day (breakfast, lunch, dinner, snack1, snack2)
3. Valid JSON format only
4. Realistic nutritional values

Return ONLY this JSON structure:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "determine from meals - options: Balanced, Vegetarian, Keto, High Protein, Low Carb"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Specific Meal Name",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 25,
          "carbs": 45,
          "fat": 15,
          "fiber": 5,
          "sugar": 10,
          "ingredients": [
            {"name": "oats", "quantity": "1", "unit": "cup", "calories": 150, "protein": 5, "carbs": 27, "fat": 3}
          ],
          "instructions": ["Step 1", "Step 2"],
          "prepTime": 10,
          "cookTime": 5,
          "servings": 1,
          "youtubeSearchTerm": "healthy breakfast recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "easy"
        },
        {
          "type": "lunch",
          "name": "Lunch Meal",
          "calories": ${Math.round(dailyCalories * 0.30)},
          "protein": 30,
          "carbs": 50,
          "fat": 20,
          "fiber": 8,
          "sugar": 5,
          "ingredients": [{"name": "chicken", "quantity": "150", "unit": "g", "calories": 250, "protein": 25, "carbs": 0, "fat": 15}],
          "instructions": ["Cook chicken", "Serve"],
          "prepTime": 15,
          "cookTime": 20,
          "servings": 1,
          "youtubeSearchTerm": "healthy lunch recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "medium"
        },
        {
          "type": "dinner",
          "name": "Dinner Meal",
          "calories": ${Math.round(dailyCalories * 0.30)},
          "protein": 35,
          "carbs": 40,
          "fat": 18,
          "fiber": 6,
          "sugar": 3,
          "ingredients": [{"name": "salmon", "quantity": "150", "unit": "g", "calories": 300, "protein": 30, "carbs": 0, "fat": 20}],
          "instructions": ["Season salmon", "Grill"],
          "prepTime": 10,
          "cookTime": 15,
          "servings": 1,
          "youtubeSearchTerm": "grilled salmon recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "medium"
        },
        {
          "type": "snack1",
          "name": "Morning Snack",
          "calories": ${Math.round(dailyCalories * 0.08)},
          "protein": 8,
          "carbs": 15,
          "fat": 5,
          "fiber": 3,
          "sugar": 8,
          "ingredients": [{"name": "apple", "quantity": "1", "unit": "medium", "calories": 80, "protein": 0, "carbs": 20, "fat": 0}],
          "instructions": ["Wash apple", "Slice"],
          "prepTime": 2,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "healthy snack",
          "cuisine": "general",
          "difficulty": "easy"
        },
        {
          "type": "snack2",
          "name": "Evening Snack",
          "calories": ${Math.round(dailyCalories * 0.07)},
          "protein": 6,
          "carbs": 12,
          "fat": 4,
          "fiber": 2,
          "sugar": 6,
          "ingredients": [{"name": "nuts", "quantity": "30", "unit": "g", "calories": 180, "protein": 6, "carbs": 5, "fat": 15}],
          "instructions": ["Portion nuts"],
          "prepTime": 1,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "healthy nuts snack",
          "cuisine": "general",
          "difficulty": "easy"
        }
      ]
    }
  ]
}

Generate all 7 days following this exact pattern. Each day must have different meals with cultural preferences for ${userProfile?.nationality || 'international'} cuisine.`;

    console.log('Sending request to OpenAI with strict 7-day format');
    
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
            content: `You are a professional nutritionist. Respond ONLY with valid JSON. Generate exactly 7 days, each with exactly 5 meals. Include a dietType in weekSummary based on the meal content (Balanced, Vegetarian, Keto, High Protein, Low Carb). Ensure all nutritional values are realistic and sum correctly.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
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

    // Enhanced validation
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
      throw new Error('Invalid meal plan structure: days must be an array');
    }

    if (generatedPlan.days.length !== 7) {
      console.error('Generated plan has', generatedPlan.days.length, 'days instead of 7');
      throw new Error(`Invalid meal plan structure: Must contain exactly 7 days, got ${generatedPlan.days.length}`);
    }

    // Validate each day
    for (let i = 0; i < generatedPlan.days.length; i++) {
      const day = generatedPlan.days[i];
      if (!day.meals || !Array.isArray(day.meals)) {
        throw new Error(`Day ${i + 1} meals must be an array`);
      }
      if (day.meals.length !== 5) {
        throw new Error(`Day ${i + 1} must have exactly 5 meals, got ${day.meals.length}`);
      }
      
      // Ensure dayNumber is correct
      day.dayNumber = i + 1;
      
      // Validate meal types
      const requiredTypes = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
      const mealTypes = day.meals.map(m => m.type);
      for (const type of requiredTypes) {
        if (!mealTypes.includes(type)) {
          throw new Error(`Day ${i + 1} missing meal type: ${type}`);
        }
      }
    }

    // Add diet type if missing
    if (!generatedPlan.weekSummary) {
      generatedPlan.weekSummary = {};
    }
    if (!generatedPlan.weekSummary.dietType) {
      generatedPlan.weekSummary.dietType = 'Balanced';
    }

    console.log('Validation complete - 7 days, 35 meals total');
    console.log('Starting food database population...');
    
    // Populate food database with meal data
    const foodItems = new Map();
    
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
        
        // Add individual ingredients
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

    console.log('Enhanced 7-day meal plan generation completed successfully');
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
