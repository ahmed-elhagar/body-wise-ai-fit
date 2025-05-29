
import { useMealPlanData } from './useMealPlanData';
import { getWeekStartDate } from '@/utils/mealPlanUtils';

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { data: currentWeekPlan, isLoading, error, refetch } = useMealPlanData(weekOffset);

  return {
    currentWeekPlan,
    isLoading,
    error,
    refetch,
    getWeekStartDate: (offset: number) => getWeekStartDate(offset)
  };
};

export type { MealIngredient, DailyMeal, WeeklyMealPlan } from './useMealPlanData';
