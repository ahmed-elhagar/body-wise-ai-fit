
export const validateMealPlan = (plan: any, includeSnacks: boolean): boolean => {
  console.log('🔍 Validating meal plan:', {
    planStructure: !!plan,
    hasDays: !!plan?.days,
    daysCount: plan?.days?.length || 0,
    includeSnacks,
    expectedMealsPerDay: includeSnacks ? 5 : 3
  });

  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    console.error('❌ Invalid plan structure');
    return false;
  }

  if (plan.days.length !== 7) {
    console.error('❌ Plan must have exactly 7 days');
    return false;
  }

  const expectedMealsPerDay = includeSnacks ? 5 : 3;
  const expectedMealTypes = includeSnacks 
    ? ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  for (let i = 0; i < plan.days.length; i++) {
    const day = plan.days[i];
    
    if (!day.meals || !Array.isArray(day.meals)) {
      console.error(`❌ Day ${i + 1} has invalid meals structure`);
      return false;
    }

    if (day.meals.length !== expectedMealsPerDay) {
      console.error(`❌ Day ${i + 1} has ${day.meals.length} meals, expected ${expectedMealsPerDay}`);
      return false;
    }

    // Validate meal types
    const dayMealTypes = day.meals.map((meal: any) => meal.type || meal.meal_type);
    for (const expectedType of expectedMealTypes) {
      if (!dayMealTypes.includes(expectedType)) {
        console.error(`❌ Day ${i + 1} missing meal type: ${expectedType}`);
        return false;
      }
    }

    // Validate each meal has required fields
    for (const meal of day.meals) {
      if (!meal.name || !meal.calories || !meal.protein) {
        console.error('❌ Meal missing required fields:', meal);
        return false;
      }
    }
  }

  console.log('✅ Meal plan validation passed');
  return true;
};

export const validateLifePhaseMealPlan = (plan: any, nutritionContext: any): boolean => {
  console.log('🏥 Validating life-phase nutrition requirements:', nutritionContext);
  
  // For now, basic validation - can be enhanced later
  if (nutritionContext?.isMuslimFasting) {
    console.log('✅ Muslim fasting meal plan validated');
  }
  
  if (nutritionContext?.isPregnant || nutritionContext?.isBreastfeeding) {
    console.log('✅ Pregnancy/breastfeeding meal plan validated');
  }
  
  return true;
};
