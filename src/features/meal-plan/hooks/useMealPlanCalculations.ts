
import { useMemo } from 'react';
import type { MealPlanFetchResult } from '@/features/meal-plan/types';

export const useMealPlanCalculations = (
  currentWeekPlan: MealPlanFetchResult | null | undefined,
  selectedDayNumber: number
) => {
  return useMemo(() => {
    const dailyMeals =
      currentWeekPlan?.dailyMeals?.filter(
        (meal) => meal.day_number === selectedDayNumber
      ) || [];

    const today = new Date();
    // Match app's day numbering: Saturday = 1, Sunday = 2, ..., Friday = 7
    const jsDay = today.getDay();
    const todayDayNumber = jsDay === 6 ? 1 : jsDay + 2;

    const todaysMeals =
      currentWeekPlan?.dailyMeals?.filter(
        (meal) => meal.day_number === todayDayNumber
      ) || [];

    const totalCalories = dailyMeals.reduce(
      (total, meal) => total + (meal.calories || 0),
      0
    );

    const totalProtein = dailyMeals.reduce(
      (total, meal) => total + (meal.protein || 0),
      0
    );

    // This could be fetched from user profile in the future
    const targetDayCalories = 2000;

    return {
      dailyMeals,
      todaysMeals,
      totalCalories,
      totalProtein,
      targetDayCalories,
    };
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);
};
