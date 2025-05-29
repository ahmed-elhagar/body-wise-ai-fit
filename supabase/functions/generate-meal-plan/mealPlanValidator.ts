
export const validateMealPlan = (plan: any, includeSnacks: boolean = true) => {
  console.log('🔍 Validating AI-generated meal plan...');
  console.log('🔍 Plan structure:', JSON.stringify(plan, null, 2));
  
  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    throw new Error('Invalid meal plan structure - missing days array');
  }

  if (plan.days.length !== 7) {
    throw new Error(`Invalid number of days: ${plan.days.length}. Expected 7 days.`);
  }

  const minMealsPerDay = 3; // breakfast, lunch, dinner
  const maxMealsPerDay = includeSnacks ? 5 : 3;
  let totalMeals = 0;

  for (let i = 0; i < plan.days.length; i++) {
    const day = plan.days[i];
    
    if (!day.meals || !Array.isArray(day.meals)) {
      throw new Error(`Day ${i + 1} is missing meals array`);
    }

    const mealCount = day.meals.length;
    if (mealCount < minMealsPerDay) {
      throw new Error(`Day ${i + 1} has only ${mealCount} meals. Expected at least ${minMealsPerDay} meals.`);
    }

    if (mealCount > maxMealsPerDay) {
      console.log(`⚠️ Day ${i + 1} has ${mealCount} meals, which is more than expected ${maxMealsPerDay}. Continuing validation...`);
    }

    totalMeals += mealCount;

    // Validate that we have the core meal types (breakfast, lunch, dinner)
    const coreMealTypes = ['breakfast', 'lunch', 'dinner'];
    const actualMealTypes = day.meals.map(meal => meal.type?.toLowerCase() || '');
    
    for (const coreType of coreMealTypes) {
      const hasCoreMeal = actualMealTypes.some(type => 
        type === coreType || 
        type.includes(coreType) ||
        // Handle cases where AI might use different naming
        (coreType === 'breakfast' && (type.includes('morning') || type.includes('break'))) ||
        (coreType === 'lunch' && (type.includes('noon') || type.includes('mid'))) ||
        (coreType === 'dinner' && (type.includes('evening') || type.includes('night')))
      );
      
      if (!hasCoreMeal) {
        console.log(`⚠️ Day ${i + 1} might be missing ${coreType} meal. Available types:`, actualMealTypes);
        // Don't throw error, just log warning and continue
      }
    }

    // Validate each meal has required fields
    for (const meal of day.meals) {
      if (!meal.name || !meal.type) {
        throw new Error(`Invalid meal structure in day ${i + 1}: missing name or type. Meal: ${JSON.stringify(meal)}`);
      }
      
      // Ensure calories is a valid number
      if (typeof meal.calories !== 'number' || meal.calories < 0) {
        console.log(`⚠️ Invalid calories for meal "${meal.name}" in day ${i + 1}. Setting to 0.`);
        meal.calories = 0;
      }
    }
  }

  const expectedMinMeals = minMealsPerDay * 7;
  const expectedMaxMeals = maxMealsPerDay * 7;

  if (totalMeals < expectedMinMeals) {
    throw new Error(`Total meals too few: ${totalMeals}. Expected at least ${expectedMinMeals} meals.`);
  }

  if (totalMeals > expectedMaxMeals) {
    console.log(`⚠️ Total meals more than expected: ${totalMeals}. Expected max ${expectedMaxMeals} meals. Continuing...`);
  }

  console.log(`✅ Meal plan validation passed - 7 days with ${totalMeals} total meals (snacks expected: ${includeSnacks})`);
};
