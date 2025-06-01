
import { useCallback } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useMealPlanNavigation } from './useMealPlanNavigation';
import { useMealPlanCalculations } from './useMealPlanCalculations';
import { useMealPlanDialogs } from './useMealPlanDialogs';
import { useAIMealPlan } from './useAIMealPlan';

export const useMealPlanState = () => {
  // Core hooks
  const navigation = useMealPlanNavigation();
  const dialogs = useMealPlanDialogs();
  const { generateMealPlan, isGenerating, remainingCredits } = useAIMealPlan();
  
  // Data fetching
  const { 
    data: mealPlanData, 
    isLoading, 
    error, 
    refetch 
  } = useMealPlanData(navigation.currentWeekOffset);
  
  // Calculations
  const calculations = useMealPlanCalculations(mealPlanData, navigation.selectedDayNumber);

  // Enhanced logging
  console.log('🔍 MEAL PLAN STATE:', {
    currentWeekOffset: navigation.currentWeekOffset,
    selectedDayNumber: navigation.selectedDayNumber,
    hasWeeklyPlan: !!mealPlanData?.weeklyPlan,
    dailyMealsCount: mealPlanData?.dailyMeals?.length || 0,
    isLoading,
    isGenerating,
    remainingCredits,
    error: error?.message
  });

  // Generate meal plan with enhanced error handling
  const handleGenerateAI = useCallback(async () => {
    const result = await generateMealPlan(dialogs.aiPreferences, {
      weekOffset: navigation.currentWeekOffset
    });
    
    if (result.success) {
      dialogs.setShowAIDialog(false);
      // Wait a moment for the database to update, then refetch
      setTimeout(() => {
        refetch();
      }, 1000);
    }
    
    return result;
  }, [generateMealPlan, dialogs.aiPreferences, navigation.currentWeekOffset, refetch]);

  // Manual refetch
  const handleRefetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered');
    await refetch();
  }, [refetch]);

  return {
    // Navigation
    ...navigation,
    
    // Dialogs
    ...dialogs,
    
    // Data
    mealPlanData,
    isLoading,
    error,
    
    // Calculations
    ...calculations,
    
    // Actions
    isGenerating,
    remainingCredits,
    handleGenerateAI,
    refetch: handleRefetch,
    
    // Helper methods
    openRecipeDialog: dialogs.openRecipeDialog,
    openExchangeDialog: dialogs.openExchangeDialog
  };
};
