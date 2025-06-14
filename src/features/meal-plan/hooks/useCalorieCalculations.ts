
import { useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import type { DailyMeal } from '../types';

export const useCalorieCalculations = (selectedDayNumber: number, currentWeekOffset: number) => {
  const { data: currentWeekPlan } = useMealPlanData(currentWeekOffset);

  const calculations = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) {
      return {
        dailyMeals: [],
        totalCalories: 0,
        totalProtein: 0,
        targetDayCalories: 2000,
        remainingCalories: 2000,
        progressPercentage: 0,
        isOverTarget: false
      };
    }

    // Get meals for the selected day
    const dailyMeals = currentWeekPlan.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === selectedDayNumber
    );

    // Calculate totals for the selected day
    const totalCalories = dailyMeals.reduce(
      (sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 
      0
    );
    
    const totalProtein = dailyMeals.reduce(
      (sum: number, meal: DailyMeal) => sum + (meal.protein || 0), 
      0
    );

    // Default target calories (could be made dynamic based on user profile)
    const targetDayCalories = 2000;
    
    const remainingCalories = targetDayCalories - totalCalories;
    const progressPercentage = Math.min((totalCalories / targetDayCalories) * 100, 100);
    const isOverTarget = totalCalories > targetDayCalories;

    return {
      dailyMeals,
      totalCalories,
      totalProtein,
      targetDayCalories,
      remainingCalories,
      progressPercentage,
      isOverTarget
    };
  }, [currentWeekPlan, selectedDayNumber]);

  return calculations;
};
