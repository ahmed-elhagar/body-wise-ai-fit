
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

    console.log('=== MEAL PLAN GENERATION START ===');
    console.log('User Profile:', JSON.stringify(userProfile, null, 2));
    console.log('Preferences:', JSON.stringify(preferences, null, 2));

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
    console.log('Calculated daily calories:', dailyCalories);

    // Enhanced prompt with EXTREMELY strict requirements
    const prompt = `You are a professional nutritionist AI. You MUST create a complete 7-day meal plan with EXACTLY 35 meals (7 days × 5 meals per day).

CRITICAL REQUIREMENTS - FAILURE MEANS COMPLETE REJECTION:
1. EXACTLY 7 days (Monday=1 to Sunday=7)
2. EXACTLY 5 meals per day (breakfast, lunch, dinner, snack1, snack2)
3. TOTAL: 35 meals - NO EXCEPTIONS
4. Valid JSON only - no markdown, no text before/after
5. All meal types must be present for each day

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

Return ONLY this JSON structure - NO OTHER TEXT:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "Weight Loss"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Foul Medames with Whole Wheat Pita",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 15,
          "carbs": 45,
          "fat": 8,
          "fiber": 6,
          "sugar": 12,
          "ingredients": [
            {"name": "fava beans", "quantity": "1", "unit": "cup", "calories": 180, "protein": 12, "carbs": 33, "fat": 1},
            {"name": "whole wheat pita", "quantity": "1", "unit": "piece", "calories": 170, "protein": 6, "carbs": 35, "fat": 2}
          ],
          "instructions": ["Soak fava beans overnight", "Cook until tender", "Season with cumin and lemon", "Serve with pita"],
          "prepTime": 10,
          "cookTime": 20,
          "servings": 1,
          "youtubeSearchTerm": "traditional foul medames recipe",
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
          "instructions": ["Season chicken", "Grill until cooked", "Mix with fresh greens", "Add dressing"],
          "prepTime": 15,
          "cookTime": 20,
          "servings": 1,
          "youtubeSearchTerm": "healthy grilled chicken salad",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "medium"
        },
        {
          "type": "dinner",
          "name": "Baked Fish with Vegetables", 
          "calories": ${Math.round(dailyCalories * 0.30)},
          "protein": 40,
          "carbs": 20,
          "fat": 15,
          "fiber": 6,
          "sugar": 5,
          "ingredients": [
            {"name": "white fish fillet", "quantity": "200", "unit": "g", "calories": 220, "protein": 35, "carbs": 0, "fat": 8},
            {"name": "mixed vegetables", "quantity": "1", "unit": "cup", "calories": 50, "protein": 2, "carbs": 10, "fat": 0}
          ],
          "instructions": ["Season fish", "Bake with vegetables", "Serve with lemon"],
          "prepTime": 10,
          "cookTime": 25,
          "servings": 1,
          "youtubeSearchTerm": "baked fish with vegetables",
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

CRITICAL: You MUST generate ALL 7 DAYS following this exact pattern. Copy the structure above for days 2-7, changing meal names but keeping the same format. Each day must have EXACTLY 5 meals. The response must contain EXACTLY 35 meals total.

ABSOLUTELY NO TEXT BEFORE OR AFTER THE JSON. START WITH { AND END WITH }.`;

    console.log('Sending request to OpenAI with enhanced 7-day strict prompt');
    
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
            content: `You are a strict nutritionist AI. You MUST respond with ONLY valid JSON containing exactly 7 days with exactly 5 meals each (35 total meals). No markdown, no explanations, no extra text. Start with { and end with }. Generate meals suitable for ${userProfile?.nationality || 'international'} cuisine preferences. Focus on ${userProfile?.fitness_goal || 'balanced nutrition'}.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, content length:', data.choices[0]?.message?.content?.length);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedPlan;
    try {
      const content = data.choices[0].message.content;
      console.log('Raw OpenAI content preview:', content.substring(0, 200) + '...');
      
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
      console.log('Plan structure check - days:', generatedPlan.days?.length);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // ULTRA STRICT validation
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
      console.error('Invalid plan structure - days not array:', generatedPlan);
      throw new Error('Invalid meal plan structure: days must be an array');
    }

    if (generatedPlan.days.length !== 7) {
      console.error('CRITICAL: Generated plan has', generatedPlan.days.length, 'days instead of 7');
      throw new Error(`STRICT REQUIREMENT VIOLATION: Must contain exactly 7 days, got ${generatedPlan.days.length}`);
    }

    let totalMeals = 0;
    for (let i = 0; i < generatedPlan.days.length; i++) {
      const day = generatedPlan.days[i];
      if (!day.meals || !Array.isArray(day.meals)) {
        throw new Error(`Day ${i + 1} meals must be an array`);
      }
      if (day.meals.length !== 5) {
        console.error(`Day ${i + 1} has ${day.meals.length} meals instead of 5:`, day.meals.map(m => m.type));
        throw new Error(`Day ${i + 1} must have exactly 5 meals, got ${day.meals.length}`);
      }
      
      totalMeals += day.meals.length;
      day.dayNumber = i + 1;
      
      const requiredTypes = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
      const mealTypes = day.meals.map(m => m.type);
      for (const type of requiredTypes) {
        if (!mealTypes.includes(type)) {
          throw new Error(`Day ${i + 1} missing meal type: ${type}`);
        }
      }
    }

    if (totalMeals !== 35) {
      console.error('CRITICAL: Total meals is', totalMeals, 'instead of 35');
      throw new Error(`STRICT REQUIREMENT VIOLATION: Must have exactly 35 meals total, got ${totalMeals}`);
    }

    // Ensure dietType exists
    if (!generatedPlan.weekSummary) {
      generatedPlan.weekSummary = {};
    }
    if (!generatedPlan.weekSummary.dietType) {
      generatedPlan.weekSummary.dietType = userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : 'Balanced';
    }

    console.log('✅ VALIDATION PASSED - 7 days with 35 total meals confirmed');
    
    // Delete existing meals for this week before saving new ones
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    
    console.log('Deleting existing plan for week:', weekStartDate.toISOString().split('T')[0]);
    const { error: deleteError } = await supabase
      .from('weekly_meal_plans')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('week_start_date', weekStartDate.toISOString().split('T')[0]);
    
    if (deleteError) {
      console.error('Error deleting existing plan:', deleteError);
    }

    // Save new weekly plan
    console.log('Saving new weekly plan...');
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

    console.log('Weekly plan saved with ID:', weeklyPlan.id);

    // Save ALL 35 meals systematically
    let totalMealsSaved = 0;
    let failedMeals = 0;

    for (let dayIndex = 0; dayIndex < generatedPlan.days.length; dayIndex++) {
      const day = generatedPlan.days[dayIndex];
      console.log(`Saving meals for day ${dayIndex + 1} (${day.meals.length} meals)...`);
      
      for (let mealIndex = 0; mealIndex < day.meals.length; mealIndex++) {
        const meal = day.meals[mealIndex];
        
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
          console.error(`Error saving meal ${mealIndex + 1} of day ${dayIndex + 1}:`, mealError);
          failedMeals++;
        } else {
          totalMealsSaved++;
        }
      }
    }

    console.log(`✅ MEAL SAVING COMPLETE: ${totalMealsSaved} meals saved, ${failedMeals} failed out of 35 expected`);

    if (totalMealsSaved < 30) {
      console.error('WARNING: Less than 30 meals saved, this is critical!');
    }

    // Populate food database efficiently
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

    console.log('=== MEAL PLAN GENERATION COMPLETE ===');
    console.log(`✅ SUCCESS: Generated ${generatedPlan.days.length} days with ${totalMealsSaved} meals`);
    
    return new Response(JSON.stringify({ generatedPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===');
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
