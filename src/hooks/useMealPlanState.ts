
import { useCallback, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "./useMealPlanNavigation";
import { useMealPlanCalculations } from "./useMealPlanCalculations";
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

  // AI Loading state - separate from isGenerating to prevent hooks issues
  const [aiLoadingState, setAiLoadingState] = useState({
    isGenerating: false,
    currentStep: '',
    progress: 0
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

  // Enhanced AI generation with proper loading state management
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
      
      // Set AI loading state
      setAiLoadingState({
        isGenerating: true,
        currentStep: 'Initializing generation...',
        progress: 0
      });
      
      // Include preferences with current week offset
      const enhancedPreferences = {
        ...dialogs.aiPreferences,
        weekOffset: navigation.currentWeekOffset,
        language
      };
      
      // Update loading steps during generation
      const updateProgress = (step: string, progress: number) => {
        setAiLoadingState(prev => ({
          ...prev,
          currentStep: step,
          progress
        }));
      };
      
      updateProgress('Analyzing your profile...', 25);
      
      const result = await generateMealPlan(enhancedPreferences, { 
        weekOffset: navigation.currentWeekOffset 
      });
      
      if (result) {
        console.log('✅ Generation successful:', {
          weekOffset: navigation.currentWeekOffset
        });
        
        updateProgress('Saving meal plan...', 75);
        
        // Invalidate queries and refetch
        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        // Wait for database update
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        updateProgress('Finalizing...', 100);
        
        // Refetch data
        await refetchMealPlan?.();
        
        // Close dialog and clear loading state
        closeAIDialog();
        setAiLoadingState({
          isGenerating: false,
          currentStep: '',
          progress: 0
        });
        
        // Show success message
        toast.success(
          language === 'ar'
            ? 'تم إنشاء خطة الوجبات بنجاح!'
            : 'Meal plan generated successfully!'
        );
        
        return true;
      }
      
      throw new Error('Generation failed');
    } catch (error) {
      console.error('❌ Generation failed:', error);
      
      // Clear loading state on error
      setAiLoadingState({
        isGenerating: false,
        currentStep: '',
        progress: 0
      });
      
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

  return {
    // Navigation state
    ...navigation,
    
    // Dialog state and actions
    ...dialogs,
    setDialogs,
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
    isGenerating: aiLoadingState.isGenerating || isGenerating, // Combine both states
    error,
    
    // AI Loading state
    aiLoadingState,
    
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
