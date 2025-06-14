
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
    maxPrepTime: '30', // Changed to string to match type
    mealTypes: ['breakfast', 'lunch', 'dinner']
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

  const calorieCalculations = useCalorieCalculations(selectedDayNumber, currentWeekOffset);

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
  } = useMealPlanActions(currentWeekOffset, refetch, closeAIDialog, (error) => handleAIError(error, { operation: 'meal plan generation' }));

  // Wrapped AI plan generation with error handling
  const handleGenerateAIPlanWithPreferences = useCallback(async (preferences: any) => {
    try {
      await wrapAIOperation(
        () => handleGenerateAIPlan(preferences),
        { 
          operation: 'meal plan generation',
          model: 'GPT-4',
          credits: preferences.includeSnacks ? 15 : 10
        }
      );
      return true;
    } catch (error) {
      console.error('Meal plan generation failed:', error);
      return false;
    }
  }, [handleGenerateAIPlan, wrapAIOperation]);

  return {
    currentWeekPlan,
    dailyMeals: calorieCalculations.dailyMeals,
    isLoading,
    error,
    refetch,
    isGenerating,
    handleGenerateAIPlan: handleGenerateAIPlanWithPreferences,
    selectedDayNumber,
    totalCalories: calorieCalculations.totalCalories,
    totalProtein: calorieCalculations.totalProtein,
    targetDayCalories: calorieCalculations.targetDayCalories,
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
