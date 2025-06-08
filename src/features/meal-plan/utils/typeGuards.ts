
// Type guards for enhanced type safety
import type { 
  StrictDailyMeal, 
  StrictWeeklyMealPlan, 
  StrictMealPlanFetchResult 
} from '../types/enhanced';

export const isValidMealType = (value: string): value is StrictDailyMeal['meal_type'] => {
  return ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].includes(value);
};

export const isStrictDailyMeal = (value: any): value is StrictDailyMeal => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isValidMealType(value.meal_type) &&
    typeof value.calories === 'number' &&
    typeof value.protein === 'number' &&
    typeof value.carbs === 'number' &&
    typeof value.fat === 'number' &&
    Array.isArray(value.ingredients) &&
    Array.isArray(value.instructions)
  );
};

export const isStrictWeeklyMealPlan = (value: any): value is StrictWeeklyMealPlan => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.user_id === 'string' &&
    typeof value.week_start_date === 'string' &&
    typeof value.total_calories === 'number'
  );
};

export const isStrictMealPlanFetchResult = (value: any): value is StrictMealPlanFetchResult => {
  return (
    value &&
    typeof value === 'object' &&
    isStrictWeeklyMealPlan(value.weeklyPlan) &&
    Array.isArray(value.dailyMeals) &&
    value.dailyMeals.every(isStrictDailyMeal)
  );
};

export const assertIsValidMeal = (meal: any): asserts meal is StrictDailyMeal => {
  if (!isStrictDailyMeal(meal)) {
    throw new Error(`Invalid meal object: ${JSON.stringify(meal)}`);
  }
};
