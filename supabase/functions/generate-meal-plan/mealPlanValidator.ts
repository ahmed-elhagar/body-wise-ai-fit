
interface MealPlan {
  weekSummary: {
    totalCalories: number;
    avgDailyCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  days: Array<{
    dayNumber: number;
    dayName: string;
    totalCalories: number;
    meals: Array<{
      type: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      ingredients: Array<{
        name: string;
        quantity: string;
        unit: string;
      }>;
      instructions: string[];
      prepTime: number;
      cookTime: number;
      servings: number;
    }>;
  }>;
}

export const validateMealPlan = (mealPlan: any, includeSnacks: boolean): void => {
  if (!mealPlan || typeof mealPlan !== 'object') {
    throw new Error('Invalid meal plan structure: must be an object');
  }

  if (!mealPlan.weekSummary) {
    throw new Error('Missing weekSummary in meal plan');
  }

  if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
    throw new Error('Missing or invalid days array in meal plan');
  }

  if (mealPlan.days.length !== 7) {
    throw new Error(`Expected 7 days, got ${mealPlan.days.length}`);
  }

  const expectedMealsPerDay = includeSnacks ? 5 : 3;
  const requiredMealTypes = includeSnacks 
    ? ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  mealPlan.days.forEach((day: any, dayIndex: number) => {
    validateDay(day, dayIndex + 1, expectedMealsPerDay, requiredMealTypes);
  });

  validateWeekSummary(mealPlan.weekSummary);
};

const validateDay = (day: any, dayNumber: number, expectedMealsCount: number, requiredMealTypes: string[]): void => {
  if (!day.meals || !Array.isArray(day.meals)) {
    throw new Error(`Day ${dayNumber}: Missing or invalid meals array`);
  }

  if (day.meals.length !== expectedMealsCount) {
    throw new Error(`Day ${dayNumber}: Expected ${expectedMealsCount} meals, got ${day.meals.length}`);
  }

  day.meals.forEach((meal: any, mealIndex: number) => {
    validateMeal(meal, dayNumber, mealIndex);
  });

  // Check if all required meal types are present
  const mealTypes = day.meals.map((meal: any) => meal.type);
  const missingTypes = requiredMealTypes.filter(type => !mealTypes.includes(type));
  if (missingTypes.length > 0) {
    throw new Error(`Day ${dayNumber}: Missing meal types: ${missingTypes.join(', ')}`);
  }
};

const validateMeal = (meal: any, dayNumber: number, mealIndex: number): void => {
  const mealId = `Day ${dayNumber}, Meal ${mealIndex + 1}`;
  
  if (!meal.name || typeof meal.name !== 'string') {
    throw new Error(`${mealId}: Missing or invalid meal name`);
  }

  if (!meal.type || typeof meal.type !== 'string') {
    throw new Error(`${mealId}: Missing or invalid meal type`);
  }

  if (typeof meal.calories !== 'number' || meal.calories <= 0) {
    throw new Error(`${mealId}: Invalid calories value`);
  }

  if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
    throw new Error(`${mealId}: Missing or empty ingredients array`);
  }

  if (!meal.instructions || !Array.isArray(meal.instructions) || meal.instructions.length === 0) {
    throw new Error(`${mealId}: Missing or empty instructions array`);
  }

  // Validate ingredients
  meal.ingredients.forEach((ingredient: any, ingredientIndex: number) => {
    if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
      throw new Error(`${mealId}, Ingredient ${ingredientIndex + 1}: Missing name, quantity, or unit`);
    }
  });
};

const validateWeekSummary = (weekSummary: any): void => {
  const requiredFields = ['totalCalories', 'avgDailyCalories', 'totalProtein', 'totalCarbs', 'totalFat'];
  
  requiredFields.forEach(field => {
    if (typeof weekSummary[field] !== 'number' || weekSummary[field] <= 0) {
      throw new Error(`Invalid or missing ${field} in weekSummary`);
    }
  });
};

export const validateLifePhaseMealPlan = (mealPlan: any, nutritionContext: any): boolean => {
  if (!nutritionContext.extraCalories || nutritionContext.extraCalories === 0) {
    return true; // No special requirements
  }

  const avgDailyCalories = mealPlan.weekSummary?.avgDailyCalories || 0;
  const expectedMinCalories = 1800 + nutritionContext.extraCalories;

  if (avgDailyCalories < expectedMinCalories) {
    console.warn(`Life-phase meal plan validation: Expected minimum ${expectedMinCalories} calories, got ${avgDailyCalories}`);
    return false;
  }

  return true;
};
