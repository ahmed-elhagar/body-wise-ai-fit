
import { useMemo, useCallback, useState } from 'react';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from '@/hooks/meal-plan/useMealPlanNavigation';
import { useMealPlanCalculations } from '@/features/meal-plan/hooks/useMealPlanCalculations';

export const useOptimizedMealPlan = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  // Navigation state
  const {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
  } = useMealPlanNavigation();

  // Core meal plan data
  const {
    data: mealPlanData,
    isLoading: isMealPlanLoading,
    error: mealPlanError,
    refetch: refetchMealPlan,
  } = useMealPlanData(currentWeekOffset);

  // Calculations
  const {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
  } = useMealPlanCalculations(mealPlanData, selectedDayNumber);

  // Memoized week days calculation
  const weekDays = useMemo(() => {
    if (!weekStartDate) return [];
    
    const days = [];
    const startDate = new Date(weekStartDate);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        number: i + 1,
        date: currentDate,
        name: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: currentDate.toDateString() === new Date().toDateString(),
      });
    }
    
    return days;
  }, [weekStartDate]);

  // Optimized meal plan actions
  const mealPlanActions = useMemo(() => ({
    generateNewPlan: useCallback(async () => {
      console.log('Generating new meal plan...');
    }, []),
    
    shuffleMeals: useCallback(async () => {
      console.log('Shuffling meals...');
    }, []),
    
    exportShoppingList: useCallback(async () => {
      console.log('Exporting shopping list...');
    }, []),
  }), []);

  // Memoized loading states
  const loadingStates = useMemo(() => ({
    isMealPlanLoading,
    isGenerating: false,
    isExchanging: false,
    isLoadingRecipe: false,
  }), [isMealPlanLoading]);

  // Progress calculations
  const progressMetrics = useMemo(() => {
    const calorieProgress = targetDayCalories > 0 
      ? Math.min((totalCalories / targetDayCalories) * 100, 100) 
      : 0;
    
    const proteinProgress = totalProtein > 0 ? Math.min((totalProtein / 150) * 100, 100) : 0;
    
    return {
      calorieProgress,
      proteinProgress,
      mealsCompleted: dailyMeals.length,
      totalMealsPlanned: 4,
    };
  }, [totalCalories, targetDayCalories, totalProtein, dailyMeals.length]);

  return {
    // Data
    mealPlanData,
    dailyMeals,
    todaysMeals,
    weekDays,
    
    // Navigation
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    weekStartDate,
    viewMode,
    setViewMode,
    
    // Calculations
    totalCalories,
    totalProtein,
    targetDayCalories,
    progressMetrics,
    
    // Actions
    mealPlanActions,
    refetchMealPlan,
    
    // Loading states
    loadingStates,
    mealPlanError,
  };
};
