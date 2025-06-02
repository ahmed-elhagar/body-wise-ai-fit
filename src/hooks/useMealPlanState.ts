
import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "@/hooks/useMealPlanNavigation";
import { useMealPlanDialogs } from "@/hooks/useMealPlanDialogs";
import { useMealPlanCalculations } from "@/hooks/useMealPlanCalculations";
import { useMealPlanHandlers } from "@/hooks/useMealPlanHandlers";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useEnhancedMealPlan } from "@/hooks/useEnhancedMealPlan";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useMealPlanState = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Core navigation and UI state
  const navigation = useMealPlanNavigation();
  const dialogs = useMealPlanDialogs();
  
  // Data fetching - single source of truth
  const { 
    data: currentWeekPlan, 
    isLoading, 
    error, 
    refetch: refetchMealPlan 
  } = useMealPlanData(navigation.currentWeekOffset);
  
  // Enhanced meal plan generation
  const { 
    generateMealPlan, 
    isGenerating, 
    nutritionContext 
  } = useEnhancedMealPlan();
  
  // Calculations based on current data
  const calculations = useMealPlanCalculations(currentWeekPlan, navigation.selectedDayNumber);
  
  // Event handlers
  const handlers = useMealPlanHandlers(
    dialogs.setSelectedMeal,
    dialogs.setSelectedMealIndex,
    dialogs.setShowRecipeDialog,
    dialogs.setShowExchangeDialog
  );

  // Enhanced AI generation with proper error handling
  const handleGenerateAIPlan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🚀 Starting AI meal plan generation:', {
        weekOffset: navigation.currentWeekOffset,
        preferences: dialogs.aiPreferences,
        userId: user?.id,
        nutritionContext
      });
      
      const result = await generateMealPlan(dialogs.aiPreferences, { 
        weekOffset: navigation.currentWeekOffset 
      });
      
      if (result?.success) {
        console.log('✅ Generation successful:', {
          weeklyPlanId: result.weeklyPlanId,
          weekOffset: navigation.currentWeekOffset
        });
        
        // Invalidate queries and refetch
        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        // Wait for database update
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Refetch data
        await refetchMealPlan?.();
        
        // Close dialog
        dialogs.setShowAIDialog(false);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Generation failed:', error);
      return false;
    }
  }, [
    dialogs.aiPreferences, 
    navigation.currentWeekOffset, 
    generateMealPlan, 
    refetchMealPlan, 
    queryClient, 
    user?.id, 
    nutritionContext,
    dialogs.setShowAIDialog
  ]);

  // Manual refetch with proper error handling
  const refetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered for week offset:', navigation.currentWeekOffset);
    try {
      await refetchMealPlan?.();
    } catch (error) {
      console.error('❌ Manual refetch failed:', error);
    }
  }, [navigation.currentWeekOffset, refetchMealPlan]);

  // Regenerate plan (same as generate for now)
  const handleRegeneratePlan = useCallback(async () => {
    console.log('🔄 Regenerating meal plan...');
    return await handleGenerateAIPlan();
  }, [handleGenerateAIPlan]);

  // Enhanced logging for debugging
  console.log('🔍 UNIFIED MEAL PLAN STATE:', {
    currentWeekOffset: navigation.currentWeekOffset,
    selectedDayNumber: navigation.selectedDayNumber,
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    hasDailyMeals: !!currentWeekPlan?.dailyMeals,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    isLoading,
    isGenerating,
    error: error?.message,
    weekStartDate: navigation.weekStartDate.toDateString(),
    nutritionContext
  });

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
    error,
    
    // Enhanced context
    nutritionContext,
    
    // Actions
    handleRegeneratePlan,
    handleGenerateAIPlan,
    refetch,
    
    // Helper methods for compatibility
    openRecipeDialog: (meal: any) => {
      dialogs.setSelectedMeal(meal);
      dialogs.setShowRecipeDialog(true);
    },
    openExchangeDialog: (meal: any, index?: number) => {
      dialogs.setSelectedMeal(meal);
      dialogs.setSelectedMealIndex(index || 0);
      dialogs.setShowExchangeDialog(true);
    }
  };
};
