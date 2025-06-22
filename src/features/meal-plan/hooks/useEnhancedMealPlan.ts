
import { useMemo } from 'react';
import { useMealPlanState } from './useMealPlanState';
import { useProfile } from '@/features/profile/hooks/useProfile';

export const useEnhancedMealPlan = () => {
  const { profile } = useProfile();
  
  // Use simplified credits approach
  const credits = 5; // Default credits
  const isPro = false; // Default non-pro
  const hasCredits = credits > 0;
  
  const mealPlanState = useMealPlanState();

  // Enhanced calculations
  const enhancedData = useMemo(() => {
    const { currentWeekPlan, dailyMeals } = mealPlanState;
    
    if (!currentWeekPlan?.weeklyPlan) {
      return {
        weeklyNutritionSummary: null,
        progressMetrics: null,
        recommendations: []
      };
    }

    // Calculate weekly nutrition summary
    const weeklyNutritionSummary = {
      totalCalories: currentWeekPlan.weeklyPlan.total_calories || 0,
      totalProtein: currentWeekPlan.weeklyPlan.total_protein || 0,
      totalCarbs: currentWeekPlan.weeklyPlan.total_carbs || 0,
      totalFat: currentWeekPlan.weeklyPlan.total_fat || 0,
      averageDailyCalories: (currentWeekPlan.weeklyPlan.total_calories || 0) / 7,
    };

    // Calculate progress metrics
    const targetCalories = profile?.weight ? profile.weight * 30 : 2000; // Rough estimate
    const progressMetrics = {
      calorieProgress: Math.round((weeklyNutritionSummary.averageDailyCalories / targetCalories) * 100),
      proteinProgress: Math.round((weeklyNutritionSummary.totalProtein / (profile?.weight || 70)) * 100),
      varietyScore: dailyMeals.length > 0 ? Math.min(dailyMeals.length * 10, 100) : 0,
    };

    // Generate recommendations
    const recommendations = [];
    if (weeklyNutritionSummary.averageDailyCalories < targetCalories * 0.8) {
      recommendations.push('Consider adding healthy snacks to meet your calorie goals');
    }
    if (progressMetrics.proteinProgress < 80) {
      recommendations.push('Add more protein-rich foods to your meals');
    }

    return {
      weeklyNutritionSummary,
      progressMetrics,
      recommendations
    };
  }, [mealPlanState.currentWeekPlan, mealPlanState.dailyMeals, profile]);

  return {
    ...mealPlanState,
    ...enhancedData,
    credits,
    isPro,
    hasCredits
  };
};
