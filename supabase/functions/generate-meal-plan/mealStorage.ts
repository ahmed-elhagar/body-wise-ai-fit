
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const saveMealsToDatabase = async (generatedPlan: any, weeklyPlanId: string) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  console.log('🍽️ Saving meals to database:', { weeklyPlanId, daysCount: generatedPlan.days?.length });

  if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
    throw new Error('Invalid meal plan structure: missing days array');
  }

  const mealsToInsert = [];
  
  for (const day of generatedPlan.days) {
    console.log(`📅 Processing day ${day.day} with ${day.meals?.length || 0} meals`);
    
    if (!day.meals || !Array.isArray(day.meals)) {
      console.warn(`⚠️ Day ${day.day} has no meals or invalid meals structure`);
      continue;
    }
    
    for (const meal of day.meals) {
      // Properly format arrays and ensure correct data types
      const mealData = {
        weekly_plan_id: weeklyPlanId,
        day_number: day.day,
        meal_type: meal.type || meal.meal_type || 'breakfast',
        name: meal.name || 'Unnamed Meal',
        calories: parseInt(meal.calories) || 0,
        protein: parseFloat(meal.protein) || 0,
        carbs: parseFloat(meal.carbs) || 0,
        fat: parseFloat(meal.fat) || 0,
        prep_time: parseInt(meal.prep_time) || 15,
        cook_time: parseInt(meal.cook_time) || 15,
        servings: parseInt(meal.servings) || 1,
        // Properly handle arrays - ensure they are actual arrays, not strings
        ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : 
                    (typeof meal.ingredients === 'string' ? [meal.ingredients] : []),
        instructions: Array.isArray(meal.instructions) ? meal.instructions : 
                     (typeof meal.instructions === 'string' ? [meal.instructions] : []),
        alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : 
                     (typeof meal.alternatives === 'string' ? [meal.alternatives] : [])
      };
      
      console.log(`✅ Prepared meal: ${mealData.name} (${mealData.meal_type}) - ${mealData.calories} cal`);
      mealsToInsert.push(mealData);
    }
  }

  if (mealsToInsert.length === 0) {
    throw new Error('No valid meals to insert');
  }

  console.log(`📊 Inserting ${mealsToInsert.length} meals into database`);

  try {
    const { data, error } = await supabase
      .from('daily_meals')
      .insert(mealsToInsert)
      .select('id');

    if (error) {
      console.error('❌ Error inserting meals:', error);
      throw new Error(`Failed to insert meals: ${error.message}`);
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} meals`);
    return { totalMealsSaved: data?.length || 0 };
  } catch (error) {
    console.error('❌ Database insertion failed:', error);
    throw error;
  }
};
