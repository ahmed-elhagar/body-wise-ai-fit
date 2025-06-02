
import { useMemo } from 'react';
import type { MealPlanFetchResult } from '../types';

export const useMealPlanCalculations = (
  mealPlanData: MealPlanFetchResult | null,
  selectedDayNumber: number
) => {
  const dailyMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    return mealPlanData.dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  }, [mealPlanData?.dailyMeals, selectedDayNumber]);

  const todaysMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    return mealPlanData.dailyMeals.filter(meal => meal.day_number === todayDayNumber);
  }, [mealPlanData?.dailyMeals]);

  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  }, [dailyMeals]);

  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  }, [dailyMeals]);

  const targetDayCalories = useMemo(() => {
    if (mealPlanData?.weeklyPlan?.total_calories) {
      return Math.round(mealPlanData.weeklyPlan.total_calories / 7);
    }
    return 2000; // Default fallback
  }, [mealPlanData?.weeklyPlan?.total_calories]);

  return {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories
  };
};
