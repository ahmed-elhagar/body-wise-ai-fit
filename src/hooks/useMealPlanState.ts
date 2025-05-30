
import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useMealPlanActions } from "@/hooks/useMealPlanActions";
import { useMealPlanNavigation } from "@/hooks/useMealPlanNavigation";
import { useMealPlanDialogs } from "@/hooks/useMealPlanDialogs";
import { useMealPlanCalculations } from "@/hooks/useMealPlanCalculations";
import { useMealPlanHandlers } from "@/hooks/useMealPlanHandlers";

export const useMealPlanState = () => {
  const { t } = useLanguage();
  
  // Use smaller, focused hooks
  const navigation = useMealPlanNavigation();
  const dialogs = useMealPlanDialogs();
  
  const { data: currentWeekPlan, isLoading, error, refetch: refetchMealPlan } = useMealPlanData(navigation.currentWeekOffset);
  const { handleRegeneratePlan, handleGenerateAIPlan, isGenerating, isShuffling } = useMealPlanActions(
    currentWeekPlan,
    navigation.currentWeekOffset,
    dialogs.aiPreferences,
    refetchMealPlan
  );

  const calculations = useMealPlanCalculations(currentWeekPlan, navigation.selectedDayNumber);
  const handlers = useMealPlanHandlers(
    dialogs.setSelectedMeal,
    dialogs.setSelectedMealIndex,
    dialogs.setShowRecipeDialog,
    dialogs.setShowExchangeDialog
  );

  // Enhanced logging for debugging
  console.log('🔍 MEAL PLAN STATE DEBUG:', {
    currentWeekOffset: navigation.currentWeekOffset,
    selectedDayNumber: navigation.selectedDayNumber,
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    hasDailyMeals: !!currentWeekPlan?.dailyMeals,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    isLoading,
    error: error?.message,
    weekStartDate: navigation.weekStartDate.toDateString()
  });

  const refetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered for week offset:', navigation.currentWeekOffset);
    try {
      await refetchMealPlan?.();
    } catch (error) {
      console.error('Manual refetch failed:', error);
    }
  }, [navigation.currentWeekOffset, refetchMealPlan]);

  const enhancedHandleGenerateAIPlan = useCallback(async () => {
    const success = await handleGenerateAIPlan();
    if (success) {
      dialogs.setShowAIDialog(false);
    }
    return success;
  }, [handleGenerateAIPlan, dialogs.setShowAIDialog]);

  return {
    // Navigation state
    ...navigation,
    
    // Dialog state
    ...dialogs,
    
    // Calculations
    ...calculations,
    
    // Handlers
    ...handlers,
    
    // Data
    currentWeekPlan,
    isLoading,
    isGenerating,
    isShuffling,
    error,
    
    // Actions
    handleRegeneratePlan,
    handleGenerateAIPlan: enhancedHandleGenerateAIPlan,
    refetch
  };
};
