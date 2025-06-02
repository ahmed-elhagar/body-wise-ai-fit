
import { useMemo } from 'react';
import type { MealPlanFetchResult, DailyMeal } from '../types';

export const useMealPlanCalculations = (
  currentWeekPlan: MealPlanFetchResult | null,
  selectedDayNumber: number
) => {
  // Calculate daily meals for selected day
  const dailyMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      meal => meal.day_number === selectedDayNumber
    );
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  // Calculate today's meals
  const todaysMeals = useMemo(() => {
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      meal => meal.day_number === todayDayNumber
    );
  }, [currentWeekPlan?.dailyMeals]);

  // Calculate total calories for selected day
  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  }, [dailyMeals]);

  // Calculate total protein for selected day
  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0);
  }, [dailyMeals]);

  // Target calories (this could be user-specific in the future)
  const targetDayCalories = 2000;

  console.log('🔍 useMealPlanCalculations:', {
    hasDailyMeals: !!dailyMeals,
    dailyMealsCount: dailyMeals?.length || 0,
    hasTodaysMeals: !!todaysMeals,
    todaysMealsCount: todaysMeals?.length || 0,
    totalCalories,
    totalProtein,
    targetDayCalories,
    selectedDayNumber
  });

  return {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories
  };
};
