
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

    // Enhanced prompt with VERY strict requirements
    const prompt = `Create a comprehensive 7-day meal plan with EXACTLY 35 meals total. THIS IS CRITICAL: Generate exactly 7 days (Monday=1 to Sunday=7), each with exactly 5 meals (breakfast, lunch, dinner, snack1, snack2).

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${userProfile?.nationality}
- Health: ${userProfile?.health_conditions?.join(', ') || 'None'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}
- Preferences: ${userProfile?.preferred_foods?.join(', ') || 'Various'}

TARGET: ${dailyCalories} calories daily

CRITICAL REQUIREMENTS - FAILURE TO MEET THESE WILL RESULT IN REJECTION:
1. EXACTLY 7 days in the "days" array
2. EXACTLY 5 meals per day in each day's "meals" array
3. Day numbers must be 1, 2, 3, 4, 5, 6, 7
4. Meal types must be: breakfast, lunch, dinner, snack1, snack2
5. Valid JSON format only - no markdown, no explanations
6. Include dietType in weekSummary

Return ONLY this JSON structure with ALL 7 DAYS:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "Balanced"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Oatmeal with Berries",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 15,
          "carbs": 45,
          "fat": 8,
          "fiber": 6,
          "sugar": 12,
          "ingredients": [
            {"name": "oats", "quantity": "1", "unit": "cup", "calories": 150, "protein": 5, "carbs": 27, "fat": 3},
            {"name": "blueberries", "quantity": "0.5", "unit": "cup", "calories": 42, "protein": 1, "carbs": 11, "fat": 0}
          ],
          "instructions": ["Cook oats with water", "Add berries on top"],
          "prepTime": 5,
          "cookTime": 5,
          "servings": 1,
          "youtubeSearchTerm": "healthy oatmeal breakfast recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "easy"
        },
        {
          "type": "lunch",
          "name": "Grilled Chicken Salad",
          "calories": ${Math.round(dailyCalories * 0.30)},
          "protein": 35,
          "carbs": 15,
          "fat": 12,
          "fiber": 8,
          "sugar": 8,
          "ingredients": [
            {"name": "chicken breast", "quantity": "150", "unit": "g", "calories": 165, "protein": 31, "carbs": 0, "fat": 4},
            {"name": "mixed greens", "quantity": "2", "unit": "cups", "calories": 20, "protein": 2, "carbs": 4, "fat": 0}
          ],
          "instructions": ["Grill chicken breast", "Mix with greens", "Add dressing"],
          "prepTime": 10,
          "cookTime": 15,
          "servings": 1,
          "youtubeSearchTerm": "grilled chicken salad recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "medium"
        },
        {
          "type": "dinner",
          "name": "Baked Salmon with Vegetables",
          "calories": ${Math.round(dailyCalories * 0.30)},
          "protein": 40,
          "carbs": 20,
          "fat": 15,
          "fiber": 6,
          "sugar": 5,
          "ingredients": [
            {"name": "salmon fillet", "quantity": "150", "unit": "g", "calories": 208, "protein": 28, "carbs": 0, "fat": 12},
            {"name": "broccoli", "quantity": "1", "unit": "cup", "calories": 25, "protein": 3, "carbs": 5, "fat": 0}
          ],
          "instructions": ["Season salmon", "Bake with vegetables", "Serve hot"],
          "prepTime": 10,
          "cookTime": 20,
          "servings": 1,
          "youtubeSearchTerm": "baked salmon recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "medium"
        },
        {
          "type": "snack1",
          "name": "Greek Yogurt with Nuts",
          "calories": ${Math.round(dailyCalories * 0.08)},
          "protein": 12,
          "carbs": 8,
          "fat": 6,
          "fiber": 2,
          "sugar": 6,
          "ingredients": [
            {"name": "greek yogurt", "quantity": "150", "unit": "g", "calories": 100, "protein": 10, "carbs": 6, "fat": 0},
            {"name": "almonds", "quantity": "15", "unit": "g", "calories": 87, "protein": 3, "carbs": 3, "fat": 8}
          ],
          "instructions": ["Mix yogurt with nuts"],
          "prepTime": 2,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "healthy yogurt snack",
          "cuisine": "general",
          "difficulty": "easy"
        },
        {
          "type": "snack2",
          "name": "Apple with Peanut Butter",
          "calories": ${Math.round(dailyCalories * 0.07)},
          "protein": 4,
          "carbs": 15,
          "fat": 8,
          "fiber": 4,
          "sugar": 12,
          "ingredients": [
            {"name": "apple", "quantity": "1", "unit": "medium", "calories": 95, "protein": 0, "carbs": 25, "fat": 0},
            {"name": "peanut butter", "quantity": "1", "unit": "tbsp", "calories": 94, "protein": 4, "carbs": 3, "fat": 8}
          ],
          "instructions": ["Slice apple", "Serve with peanut butter"],
          "prepTime": 2,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "apple peanut butter snack",
          "cuisine": "general",
          "difficulty": "easy"
        }
      ]
    }
  ]
}

IMPORTANT: Generate ALL 7 DAYS following this exact pattern. Each day must have different meals but follow the same structure. The response must be complete with all 35 meals (7 days × 5 meals).`;

    console.log('Sending enhanced request to OpenAI for 7-day meal plan');
    
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
            content: `You are a professional nutritionist. You MUST respond with ONLY valid JSON containing exactly 7 days with exactly 5 meals each (35 total meals). No markdown, no explanations, no extra text. The JSON must include a dietType in weekSummary. Generate meals suitable for ${userProfile?.nationality || 'international'} cuisine preferences.` 
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
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // STRICT validation
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
      throw new Error('Invalid meal plan structure: days must be an array');
    }

    if (generatedPlan.days.length !== 7) {
      console.error('Generated plan has', generatedPlan.days.length, 'days instead of 7');
      throw new Error(`Must contain exactly 7 days, got ${generatedPlan.days.length}`);
    }

    // Validate each day has exactly 5 meals
    for (let i = 0; i < generatedPlan.days.length; i++) {
      const day = generatedPlan.days[i];
      if (!day.meals || !Array.isArray(day.meals)) {
        throw new Error(`Day ${i + 1} meals must be an array`);
      }
      if (day.meals.length !== 5) {
        throw new Error(`Day ${i + 1} must have exactly 5 meals, got ${day.meals.length}`);
      }
      
      // Ensure correct dayNumber
      day.dayNumber = i + 1;
      
      // Validate required meal types
      const requiredTypes = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
      const mealTypes = day.meals.map(m => m.type);
      for (const type of requiredTypes) {
        if (!mealTypes.includes(type)) {
          throw new Error(`Day ${i + 1} missing meal type: ${type}`);
        }
      }
    }

    // Ensure dietType exists
    if (!generatedPlan.weekSummary) {
      generatedPlan.weekSummary = {};
    }
    if (!generatedPlan.weekSummary.dietType) {
      generatedPlan.weekSummary.dietType = 'Balanced';
    }

    console.log('Validation complete - 7 days with 35 total meals');
    
    // Delete existing meals for this week before saving new ones
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    
    // Delete existing weekly plan for this week
    const { error: deleteError } = await supabase
      .from('weekly_meal_plans')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('week_start_date', weekStartDate.toISOString().split('T')[0]);
    
    if (deleteError) {
      console.error('Error deleting existing plan:', deleteError);
    }

    // Save new weekly plan
    const { data: weeklyPlan, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .insert({
        user_id: userProfile.id,
        week_start_date: weekStartDate.toISOString().split('T')[0],
        generation_prompt: {
          userProfile,
          preferences,
          generatedAt: new Date().toISOString()
        },
        total_calories: generatedPlan.weekSummary?.totalCalories || dailyCalories * 7,
        total_protein: generatedPlan.weekSummary?.totalProtein || 700,
        total_carbs: generatedPlan.weekSummary?.totalCarbs || 2100,
        total_fat: generatedPlan.weekSummary?.totalFat || 490
      })
      .select()
      .single();

    if (weeklyError) {
      console.error('Error saving weekly plan:', weeklyError);
      throw weeklyError;
    }

    console.log('Weekly plan saved:', weeklyPlan.id);

    // Save all 35 meals (7 days × 5 meals)
    let totalMealsSaved = 0;
    for (const day of generatedPlan.days) {
      for (const meal of day.meals) {
        const { error: mealError } = await supabase
          .from('daily_meals')
          .insert({
            weekly_plan_id: weeklyPlan.id,
            day_number: day.dayNumber,
            meal_type: meal.type,
            name: meal.name || 'Unnamed Meal',
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || [],
            prep_time: meal.prepTime || 0,
            cook_time: meal.cookTime || 0,
            servings: meal.servings || 1,
            youtube_search_term: meal.youtubeSearchTerm || null,
            alternatives: meal.alternatives || []
          });

        if (mealError) {
          console.error('Error saving meal:', mealError);
        } else {
          totalMealsSaved++;
        }
      }
    }

    console.log(`Successfully saved ${totalMealsSaved} meals out of 35 expected`);

    // Populate food database
    const foodItems = new Map();
    
    for (const day of generatedPlan.days) {
      for (const meal of day.meals) {
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

    console.log('7-day meal plan generation completed successfully');
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
