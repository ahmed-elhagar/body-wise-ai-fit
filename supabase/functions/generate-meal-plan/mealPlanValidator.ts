
interface GeneratedPlan {
  days: Array<{
    dayNumber: number;
    meals: Array<{
      type: string;
      [key: string]: any;
    }>;
  }>;
  weekSummary?: {
    dietType?: string;
    [key: string]: any;
  };
}

export const validateMealPlan = (generatedPlan: GeneratedPlan): void => {
  if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
    throw new Error('Invalid meal plan structure: days must be an array');
  }

  if (generatedPlan.days.length !== 7) {
    console.error('Generated plan has', generatedPlan.days.length, 'days instead of 7');
    throw new Error(`Must contain exactly 7 days, got ${generatedPlan.days.length}`);
  }

  let totalMeals = 0;
  for (let i = 0; i < generatedPlan.days.length; i++) {
    const day = generatedPlan.days[i];
    if (!day.meals || !Array.isArray(day.meals)) {
      throw new Error(`Day ${i + 1} meals must be an array`);
    }
    if (day.meals.length !== 5) {
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
    throw new Error(`Must have exactly 35 meals total, got ${totalMeals}`);
  }

  // Ensure dietType exists
  if (!generatedPlan.weekSummary) {
    generatedPlan.weekSummary = {};
  }
  if (!generatedPlan.weekSummary.dietType) {
    generatedPlan.weekSummary.dietType = 'Balanced';
  }
};
