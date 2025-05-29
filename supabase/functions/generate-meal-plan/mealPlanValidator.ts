
export const validateMealPlan = (plan: any, includeSnacks: boolean = true) => {
  console.log('🔍 Validating AI-generated meal plan...');
  
  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    throw new Error('Invalid meal plan structure - missing days array');
  }

  if (plan.days.length !== 7) {
    throw new Error(`Invalid number of days: ${plan.days.length}. Expected 7 days.`);
  }

  const expectedMealsPerDay = includeSnacks ? 5 : 3;
  const expectedTotalMeals = expectedMealsPerDay * 7;
  let totalMeals = 0;

  for (let i = 0; i < plan.days.length; i++) {
    const day = plan.days[i];
    
    if (!day.meals || !Array.isArray(day.meals)) {
      throw new Error(`Day ${i + 1} is missing meals array`);
    }

    if (day.meals.length !== expectedMealsPerDay) {
      throw new Error(`Day ${i + 1} has ${day.meals.length} meals. Expected ${expectedMealsPerDay} meals.`);
    }

    totalMeals += day.meals.length;

    // Validate meal types based on snacks preference
    const expectedMealTypes = includeSnacks 
      ? ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2']
      : ['breakfast', 'lunch', 'dinner'];

    const actualMealTypes = day.meals.map(meal => meal.type);
    
    for (const expectedType of expectedMealTypes) {
      if (!actualMealTypes.includes(expectedType)) {
        throw new Error(`Day ${i + 1} is missing ${expectedType} meal`);
      }
    }

    // Validate each meal has required fields
    for (const meal of day.meals) {
      if (!meal.name || !meal.type || typeof meal.calories !== 'number') {
        throw new Error(`Invalid meal structure in day ${i + 1}: ${JSON.stringify(meal)}`);
      }
    }
  }

  if (totalMeals !== expectedTotalMeals) {
    throw new Error(`Total meals mismatch: ${totalMeals}. Expected ${expectedTotalMeals} meals.`);
  }

  console.log(`✅ Meal plan validation passed - 7 days with ${totalMeals} total meals confirmed (snacks: ${includeSnacks})`);
};
