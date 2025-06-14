
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useCalorieCalculations } from './useCalorieCalculations';
import { useMealPlanDialogs } from './useMealPlanDialogs';
import { useMealPlanNavigation } from './useMealPlanNavigation';
import { useMealPlanActions } from './useMealPlanActions';
import { useAIErrorHandler } from '@/hooks/useAIErrorHandler';
import type { DailyMeal } from '../types';

export const useMealPlanState = () => {
  const { handleAIError, wrapAIOperation } = useAIErrorHandler();
  
  const [aiPreferences, setAIPreferences] = useState({
    cuisine: 'any',
    prepTime: '30',
    includeSnacks: true,
    duration: 'weekly',
    maxPrepTime: '30',
    mealTypes: 'breakfast,lunch,dinner' // Changed to string to match interface
  });

  const updateAIPreferences = useCallback((newPreferences: any) => {
    setAIPreferences(newPreferences);
  }, []);

  const {
    showRecipeDialog,
    selectedMeal,
    openRecipeDialog,
    closeRecipeDialog,
    showExchangeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    showAddSnackDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    showShoppingListDialog,
    openShoppingListDialog,
    closeShoppingListDialog,
    showAIDialog,
    openAIDialog,
    closeAIDialog,
  } = useMealPlanDialogs();

  const {
    weekStartDate,
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
  } = useMealPlanNavigation();

  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch
  } = useMealPlanData(currentWeekOffset);

  const {
    handleGenerateAIPlan,
    handleRegeneratePlan,
    isGenerating,
    isShuffling,
    nutritionContext
  } = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    aiPreferences,
    refetch
  );

  // Get calorie calculations for the selected day
  const calorieCalculations = useCalorieCalculations(selectedDayNumber, currentWeekOffset);

  // Wrapped AI plan generation with error handling - no parameters needed
  const handleGenerateAIPlanWithPreferences = useCallback(async () => {
    try {
      await wrapAIOperation(
        () => handleGenerateAIPlan(),
        { 
          operation: 'meal plan generation',
          model: 'GPT-4',
          credits: aiPreferences.includeSnacks ? 15 : 10
        }
      );
      return true;
    } catch (error) {
      console.error('Meal plan generation failed:', error);
      return false;
    }
  }, [handleGenerateAIPlan, wrapAIOperation, aiPreferences.includeSnacks]);

  return {
    currentWeekPlan,
    dailyMeals: calorieCalculations.dailyMeals || [],
    isLoading,
    error,
    refetch,
    isGenerating,
    handleGenerateAIPlan: handleGenerateAIPlanWithPreferences,
    selectedDayNumber,
    totalCalories: calorieCalculations.totalCalories || 0,
    totalProtein: calorieCalculations.totalProtein || 0,
    targetDayCalories: calorieCalculations.targetDayCalories || 2000,
    weekStartDate,
    currentWeekOffset,
    setCurrentWeekOffset,
    setSelectedDayNumber,
    showAIDialog,
    openAIDialog,
    closeAIDialog,
    aiPreferences,
    updateAIPreferences,
    showRecipeDialog,
    selectedMeal,
    openRecipeDialog,
    closeRecipeDialog,
    showExchangeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    showAddSnackDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    showShoppingListDialog,
    openShoppingListDialog,
    closeShoppingListDialog
  };
};
