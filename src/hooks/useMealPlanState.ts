
import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "./useMealPlanNavigation";
import { useMealPlanDialogs } from "./useMealPlanDialogs";
import { useMealPlanCalculations } from "./useMealPlanCalculations";
import { useMealPlanHandlers } from "./useMealPlanHandlers";
import { useMealPlanData } from "./useMealPlanData";
import { useEnhancedMealPlan } from "./useEnhancedMealPlan";
import { useCreditSystem } from './useCreditSystem';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useMealPlanState = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { userCredits } = useCreditSystem();
  
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
  
  // Event handlers with proper dialog integration
  const handlers = useMealPlanHandlers(
    dialogs.openRecipeDialog,
    dialogs.openExchangeDialog
  );

  // Enhanced AI generation with proper credit checking and error handling
  const handleGenerateAIPlan = useCallback(async (): Promise<boolean> => {
    // Check credits first
    if (userCredits <= 0) {
      toast.error(
        language === 'ar' 
          ? 'لا توجد أرصدة ذكاء اصطناعي متبقية' 
          : 'No AI credits remaining'
      );
      return false;
    }

    try {
      console.log('🚀 Starting AI meal plan generation:', {
        weekOffset: navigation.currentWeekOffset,
        preferences: dialogs.aiPreferences,
        userId: user?.id,
        nutritionContext,
        userCredits
      });
      
      // Include preferences with current week offset
      const enhancedPreferences = {
        ...dialogs.aiPreferences,
        weekOffset: navigation.currentWeekOffset,
        language
      };
      
      const result = await generateMealPlan(enhancedPreferences, { 
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
        dialogs.closeAIDialog();
        
        // Show success message
        toast.success(
          language === 'ar'
            ? 'تم إنشاء خطة الوجبات بنجاح!'
            : 'Meal plan generated successfully!'
        );
        
        return true;
      }
      
      toast.error(
        language === 'ar'
          ? 'فشل في إنشاء خطة الوجبات'
          : 'Failed to generate meal plan'
      );
      return false;
    } catch (error) {
      console.error('❌ Generation failed:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء الإنشاء'
          : 'An error occurred during generation'
      );
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
    dialogs.closeAIDialog,
    userCredits,
    language
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

  // Enhanced logging for debugging
  console.log('🔍 UNIFIED MEAL PLAN STATE:', {
    currentWeekOffset: navigation.currentWeekOffset,
    selectedDayNumber: navigation.selectedDayNumber,
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    hasDailyMeals: !!currentWeekPlan?.dailyMeals,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    isLoading,
    isGenerating,
    userCredits,
    error: error?.message,
    weekStartDate: navigation.weekStartDate.toDateString(),
    nutritionContext,
    dialogStates: {
      showAIDialog: dialogs.showAIDialog,
      showRecipeDialog: dialogs.showRecipeDialog,
      showExchangeDialog: dialogs.showExchangeDialog,
      showAddSnackDialog: dialogs.showAddSnackDialog
    }
  });

  return {
    // Navigation state
    ...navigation,
    
    // Dialog state and actions
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
    userCredits,
    
    // Actions
    handleGenerateAIPlan,
    refetch,
    
    // Add snack handler
    handleAddSnack: dialogs.openAddSnackDialog
  };
};
