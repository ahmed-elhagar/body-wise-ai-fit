
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const saveMealsToDatabase = async (generatedPlan: any, weeklyPlanId: string) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  console.log('🍽️ Saving meals to database:', {
    weeklyPlanId,
    daysCount: generatedPlan.days?.length || 0
  });

  const mealsToInsert = [];
  let totalMealsSaved = 0;

  if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
    throw new Error('Invalid plan structure: missing days array');
  }

  for (let dayIndex = 0; dayIndex < generatedPlan.days.length; dayIndex++) {
    const day = generatedPlan.days[dayIndex];
    const dayNumber = dayIndex + 1;

    if (!day.meals || !Array.isArray(day.meals)) {
      console.error(`❌ Day ${dayNumber} has invalid meals structure`);
      continue;
    }

    console.log(`📅 Processing day ${dayNumber} with ${day.meals.length} meals`);

    for (const meal of day.meals) {
      try {
        const mealData = {
          weekly_plan_id: weeklyPlanId,
          day_number: dayNumber,
          meal_type: meal.type || meal.meal_type || 'breakfast',
          name: meal.name || 'Unnamed Meal',
          calories: parseInt(meal.calories) || 0,
          protein: parseFloat(meal.protein) || 0,
          carbs: parseFloat(meal.carbs) || 0,
          fat: parseFloat(meal.fat) || 0,
          prep_time: parseInt(meal.prep_time) || 15,
          cook_time: parseInt(meal.cook_time) || 15,
          servings: parseInt(meal.servings) || 1,
          ingredients: meal.ingredients ? JSON.stringify(meal.ingredients) : '[]',
          instructions: meal.instructions ? JSON.stringify(meal.instructions) : '[]',
          alternatives: meal.alternatives ? JSON.stringify(meal.alternatives) : '[]',
          youtube_search_term: meal.youtube_search_term || null,
          image_url: meal.image_url || null,
          recipe_fetched: false
        };

        mealsToInsert.push(mealData);
        totalMealsSaved++;

        console.log(`✅ Prepared meal: ${meal.name} (${meal.type || meal.meal_type}) - ${meal.calories} cal`);
      } catch (error) {
        console.error(`❌ Error preparing meal data for day ${dayNumber}:`, error, meal);
      }
    }
  }

  if (mealsToInsert.length === 0) {
    throw new Error('No valid meals to insert');
  }

  console.log(`📊 Inserting ${mealsToInsert.length} meals into database`);

  const { data: insertedMeals, error: insertError } = await supabase
    .from('daily_meals')
    .insert(mealsToInsert)
    .select();

  if (insertError) {
    console.error('❌ Error inserting meals:', insertError);
    throw new Error(`Failed to insert meals: ${insertError.message}`);
  }

  console.log('✅ Successfully saved meals:', {
    totalMealsSaved,
    insertedCount: insertedMeals?.length || 0
  });

  return { 
    totalMealsSaved,
    insertedMeals: insertedMeals || []
  };
};
