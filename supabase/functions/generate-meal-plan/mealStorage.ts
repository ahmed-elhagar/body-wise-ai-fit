import { errorCodes, MealPlanError } from './enhancedErrorHandling';

export const saveMealsToDatabase = async (
  supabaseClient: any,
  weeklyPlanId: string,
  mealsByDay: any[]
) => {
  console.log('🍽️ Saving meals to database:', { weeklyPlanId, daysCount: mealsByDay.length });
  
  const mealsToInsert = [];

  for (let dayIndex = 0; dayIndex < mealsByDay.length; dayIndex++) {
    const dayMeals = mealsByDay[dayIndex];
    const dayNumber = dayIndex + 1;
    
    console.log(`📅 Processing day ${dayNumber} with ${dayMeals.length} meals`);
    
    for (const meal of dayMeals) {
      // Map meal types to database-allowed values
      let mealType = meal.meal_type;
      if (mealType === 'snack1' || mealType === 'snack2') {
        mealType = 'snack';
      }
      
      // Validate meal type against allowed values
      const allowedMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      if (!allowedMealTypes.includes(mealType)) {
        console.warn(`⚠️ Invalid meal type: ${meal.meal_type}, defaulting to 'snack'`);
        mealType = 'snack';
      }

      const mealData = {
        weekly_plan_id: weeklyPlanId,
        day_number: dayNumber,
        meal_type: mealType,
        name: meal.name,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || [],
        prep_time: meal.prep_time || 0,
        cook_time: meal.cook_time || 0,
        servings: meal.servings || 1,
        substitutions: meal.substitutions || []
      };

      mealsToInsert.push(mealData);
      console.log(`✅ Prepared meal: ${meal.name} (${mealType}) - ${meal.calories} cal`);
    }
  }

  console.log(`📊 Inserting ${mealsToInsert.length} meals into database`);

  // Delete existing meals for this weekly plan
  const { error: deleteError } = await supabaseClient
    .from('daily_meals')
    .delete()
    .eq('weekly_plan_id', weeklyPlanId);

  if (deleteError) {
    console.error('❌ Error deleting existing meals:', deleteError);
    throw new Error(`Failed to delete existing meals: ${deleteError.message}`);
  }

  // Insert new meals
  const { data, error } = await supabaseClient
    .from('daily_meals')
    .insert(mealsToInsert);

  if (error) {
    console.error('❌ Error inserting meals:', error);
    throw new Error(`Failed to insert meals: ${error.message}`);
  }

  console.log('✅ Meals saved successfully to database');
  return data;
};
