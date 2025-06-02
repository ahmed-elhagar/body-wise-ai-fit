
import { useMemo } from 'react';
import { useOptimizedMealPlanCore } from './useOptimizedMealPlanCore';
import { isStrictMealPlanFetchResult } from '../utils/typeGuards';
import type { StrictMealPlanFetchResult } from '../types/enhanced';

export const useTypeSafeMealPlan = (
  weekOffset: number = 0,
  options?: {
    includeIngredients?: boolean;
    includeInstructions?: boolean;
    mealTypes?: ReadonlyArray<string>;
  }
) => {
  const query = useOptimizedMealPlanCore(weekOffset, options);

  const validatedData = useMemo<StrictMealPlanFetchResult | null>(() => {
    if (!query.data) return null;
    
    if (isStrictMealPlanFetchResult(query.data)) {
      return query.data;
    }
    
    console.warn('❌ Invalid meal plan data structure:', query.data);
    return null;
  }, [query.data]);

  const mealsByDay = useMemo(() => {
    if (!validatedData) return {};
    
    return validatedData.dailyMeals.reduce((acc, meal) => {
      if (!acc[meal.day_number]) {
        acc[meal.day_number] = [];
      }
      // Fix: Use spread operator instead of push to avoid mutating readonly array
      acc[meal.day_number] = [...acc[meal.day_number], meal];
      return acc;
    }, {} as Record<number, typeof validatedData.dailyMeals>);
  }, [validatedData]);

  const nutritionTotals = useMemo(() => {
    if (!validatedData) return null;
    
    return validatedData.dailyMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [validatedData]);

  return {
    ...query,
    data: validatedData,
    mealsByDay,
    nutritionTotals,
    isValid: validatedData !== null
  };
};
