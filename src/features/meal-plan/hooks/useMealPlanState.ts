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
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
  } = useCalorieCalculations();

  const {
    currentWeekPlan,
    isLoading,
    error,
    refetch
  } = useMealPlanData(currentWeekOffset);

  const {
    generateAIMealPlan,
    isGenerating,
    setIsGenerating
  } = useMealPlanActions({
    currentWeekOffset,
    refetch,
    closeAIDialog,
    onError: (error) => handleAIError(error, { operation: 'meal plan generation' })
  });

  // Wrapped AI plan generation with error handling
  const handleGenerateAIPlan = useCallback(async (preferences: any) => {
    try {
      await wrapAIOperation(
        () => generateAIMealPlan(preferences),
        { 
          operation: 'meal plan generation',
          model: 'GPT-4',
          credits: preferences.includeSnacks ? 15 : 10
        }
      );
    } catch (error) {
      console.error('Meal plan generation failed:', error);
    }
  }, [generateAIMealPlan, wrapAIOperation]);

  return {
    currentWeekPlan,
    dailyMeals,
    isLoading,
    error,
    refetch,
    isGenerating,
    handleGenerateAIPlan,
    selectedDayNumber,
    totalCalories,
    totalProtein,
    targetDayCalories,
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
