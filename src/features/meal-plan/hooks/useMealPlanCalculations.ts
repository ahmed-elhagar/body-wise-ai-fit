
import { useMemo } from 'react';
import type { MealPlanFetchResult } from '../types';

export const useMealPlanCalculations = (
  mealPlanData: MealPlanFetchResult | null,
  selectedDayNumber: number
) => {
  // Memoize daily meals with better caching
  const dailyMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    return mealPlanData.dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  }, [mealPlanData?.dailyMeals, selectedDayNumber]);

  // Optimize today's meals calculation
  const todaysMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    return mealPlanData.dailyMeals.filter(meal => meal.day_number === todayDayNumber);
  }, [mealPlanData?.dailyMeals]);

  // Memoize nutritional calculations with better performance
  const nutritionSummary = useMemo(() => {
    const totalCalories = dailyMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const totalProtein = dailyMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = dailyMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFat = dailyMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
    
    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    };
  }, [dailyMeals]);

  // Optimize target calculations
  const targetDayCalories = useMemo(() => {
    if (mealPlanData?.weeklyPlan?.total_calories) {
      return Math.round(mealPlanData.weeklyPlan.total_calories / 7);
    }
    return 2000; // Default fallback
  }, [mealPlanData?.weeklyPlan?.total_calories]);

  // Calculate completion percentage
  const dayCompletionPercentage = useMemo(() => {
    if (!targetDayCalories || !nutritionSummary.totalCalories) return 0;
    return Math.min(Math.round((nutritionSummary.totalCalories / targetDayCalories) * 100), 100);
  }, [nutritionSummary.totalCalories, targetDayCalories]);

  return {
    dailyMeals,
    todaysMeals,
    ...nutritionSummary,
    targetDayCalories,
    dayCompletionPercentage
  };
};
