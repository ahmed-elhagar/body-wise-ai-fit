import { useCallback, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "./useMealPlanNavigation";
import { useMealPlanCalculations } from "./useMealPlanCalculations";
import { useMealPlanHandlers } from "./useMealPlanHandlers";
import { useMealPlanData } from "./useMealPlanData";
import { useEnhancedMealPlan } from "./useEnhancedMealPlan";
import { useCreditSystem } from './useCreditSystem';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { MealPlanPreferences } from '@/types/mealPlan';

export const useMealPlanState = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { userCredits } = useCreditSystem();
  
  // Core navigation and UI state
  const navigation = useMealPlanNavigation();
  
  // Enhanced dialogs with proper preference management
  const [dialogs, setDialogs] = useState({
    showAIDialog: false,
    showRecipeDialog: false,
    showExchangeDialog: false,
    showAddSnackDialog: false,
    showShoppingListDialog: false,
    selectedMeal: null as any,
    selectedMealIndex: 0,
    aiPreferences: {
      duration: "7",
      cuisine: "mixed",
      maxPrepTime: "30",
      includeSnacks: true,
      mealTypes: "breakfast,lunch,dinner"
    } as MealPlanPreferences
  });
  
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
  
  // Dialog actions
  const openAIDialog = () => setDialogs(prev => ({ ...prev, showAIDialog: true }));
  const closeAIDialog = () => setDialogs(prev => ({ ...prev, showAIDialog: false }));
  
  const openRecipeDialog = (meal: any) => {
    setDialogs(prev => ({ ...prev, selectedMeal: meal, showRecipeDialog: true }));
  };
  
  const openExchangeDialog = (meal: any, index = 0) => {
    setDialogs(prev => ({ 
      ...prev, 
      selectedMeal: meal, 
      selectedMealIndex: index, 
      showExchangeDialog: true 
    }));
  };

  const updateAIPreferences = (newPreferences: MealPlanPreferences) => {
    setDialogs(prev => ({ ...prev, aiPreferences: newPreferences }));
  };

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
      
      if (result) {
        console.log('✅ Generation successful:', {
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
        closeAIDialog();
        
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
    openAIDialog,
    closeAIDialog,
    openRecipeDialog,
    closeRecipeDialog: () => setDialogs(prev => ({ ...prev, showRecipeDialog: false, selectedMeal: null })),
    openExchangeDialog,
    closeExchangeDialog: () => setDialogs(prev => ({ ...prev, showExchangeDialog: false, selectedMeal: null })),
    openAddSnackDialog: () => setDialogs(prev => ({ ...prev, showAddSnackDialog: true })),
    closeAddSnackDialog: () => setDialogs(prev => ({ ...prev, showAddSnackDialog: false })),
    updateAIPreferences,
    
    // Calculations
    ...calculations,
    
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
    handleAddSnack: () => setDialogs(prev => ({ ...prev, showAddSnackDialog: true }))
  };
};
