
import { useMemo, useCallback } from 'react';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from '@/hooks/meal-plan/useMealPlanNavigation';
import { useMealPlanDialogs } from '@/features/meal-plan/hooks/useMealPlanDialogs';
import { useMealPlanCalculations } from '@/features/meal-plan/hooks/useMealPlanCalculations';

export const useOptimizedMealPlan = () => {
  // Core meal plan data
  const {
    mealPlanData,
    isLoading: isMealPlanLoading,
    error: mealPlanError,
    refetch: refetchMealPlan,
  } = useMealPlanData();

  // Navigation state
  const {
    selectedDayNumber,
    setSelectedDayNumber,
    selectedWeekStart,
    setSelectedWeekStart,
    viewMode,
    setViewMode,
  } = useMealPlanNavigation();

  // Dialog states
  const {
    dialogStates,
    openDialog,
    closeDialog,
    selectedMeal,
  } = useMealPlanDialogs();

  // Calculations
  const {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    shoppingItems,
  } = useMealPlanCalculations(mealPlanData, selectedDayNumber);

  // Memoized week days calculation
  const weekDays = useMemo(() => {
    if (!selectedWeekStart) return [];
    
    const days = [];
    const startDate = new Date(selectedWeekStart);
    
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
  }, [selectedWeekStart]);

  // Optimized meal plan actions
  const mealPlanActions = useMemo(() => ({
    generateNewPlan: useCallback(async () => {
      // Implementation for generating new meal plan
      console.log('Generating new meal plan...');
    }, []),
    
    shuffleMeals: useCallback(async () => {
      // Implementation for shuffling meals
      console.log('Shuffling meals...');
    }, []),
    
    exportShoppingList: useCallback(async () => {
      // Implementation for exporting shopping list
      console.log('Exporting shopping list...');
    }, []),
  }), []);

  // Memoized loading states
  const loadingStates = useMemo(() => ({
    isMealPlanLoading,
    isGenerating: dialogStates.aiGeneration,
    isExchanging: dialogStates.exchange,
    isLoadingRecipe: dialogStates.recipe,
  }), [isMealPlanLoading, dialogStates]);

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
      totalMealsPlanned: 4, // breakfast, lunch, dinner, snack
    };
  }, [totalCalories, targetDayCalories, totalProtein, dailyMeals.length]);

  return {
    // Data
    mealPlanData,
    dailyMeals,
    todaysMeals,
    weekDays,
    shoppingItems,
    
    // Navigation
    selectedDayNumber,
    setSelectedDayNumber,
    selectedWeekStart,
    setSelectedWeekStart,
    viewMode,
    setViewMode,
    
    // Dialogs
    dialogStates,
    openDialog,
    closeDialog,
    selectedMeal,
    
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
