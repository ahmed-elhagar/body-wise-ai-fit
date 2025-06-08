
import { useMemo } from 'react';
import { calculateDailyNutrition } from '../utils';
import type { MealPlanFetchResult, DailyMeal } from '../types';

export const useMealPlanCalculations = (
  currentWeekPlan: MealPlanFetchResult | null,
  selectedDayNumber: number
) => {
  // Calculate daily meals for selected day
  const dailyMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === selectedDayNumber
    );
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  // Calculate today's meals
  const todaysMeals = useMemo(() => {
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === todayDayNumber
    );
  }, [currentWeekPlan?.dailyMeals]);

  // Calculate total calories for selected day
  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  }, [dailyMeals]);

  // Calculate total protein for selected day
  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  }, [dailyMeals]);

  // Target calories (this could be user-specific in the future)
  const targetDayCalories = useMemo(() => {
    if (!currentWeekPlan?.weeklyPlan?.total_calories) return 2000;
    return Math.round(currentWeekPlan.weeklyPlan.total_calories / 7);
  }, [currentWeekPlan?.weeklyPlan?.total_calories]);

  // Legacy calculations for backward compatibility
  const dailyNutrition = useMemo(() => {
    return calculateDailyNutrition(dailyMeals);
  }, [dailyMeals]);

  const nutritionPercentages = useMemo(() => {
    const { calories, protein, carbs, fats } = dailyNutrition;
    const total = protein + carbs + fats;
    
    return {
      protein: total > 0 ? Math.round((protein / total) * 100) : 0,
      carbs: total > 0 ? Math.round((carbs / total) * 100) : 0,
      fats: total > 0 ? Math.round((fats / total) * 100) : 0,
    };
  }, [dailyNutrition]);

  return {
    // New interface
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Legacy interface for backward compatibility
    dailyNutrition,
    nutritionPercentages,
  };
};
