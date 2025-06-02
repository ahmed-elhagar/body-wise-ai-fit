
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
  const openAIDialog = useCallback(() => {
    console.log('🎯 Opening AI Dialog with current preferences:', dialogs.aiPreferences);
    setDialogs(prev => ({ ...prev, showAIDialog: true }));
  }, [dialogs.aiPreferences]);
  
  const closeAIDialog = useCallback(() => {
    console.log('🎯 Closing AI Dialog');
    setDialogs(prev => ({ ...prev, showAIDialog: false }));
    // Reset loading state when closing dialog
    setAiLoadingState({
      isGenerating: false,
      currentStep: '',
      progress: 0
    });
  }, []);
  
  const openRecipeDialog = useCallback((meal: any) => {
    setDialogs(prev => ({ ...prev, selectedMeal: meal, showRecipeDialog: true }));
  }, []);
  
  const openExchangeDialog = useCallback((meal: any, index = 0) => {
    setDialogs(prev => ({ 
      ...prev, 
      selectedMeal: meal, 
      selectedMealIndex: index, 
      showExchangeDialog: true 
    }));
  }, []);

  const updateAIPreferences = useCallback((newPreferences: MealPlanPreferences) => {
    console.log('🔧 Updating AI preferences:', {
      old: dialogs.aiPreferences,
      new: newPreferences
    });
    setDialogs(prev => ({ ...prev, aiPreferences: newPreferences }));
  }, [dialogs.aiPreferences]);

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
        userCredits,
        includeSnacks: dialogs.aiPreferences.includeSnacks
      });
      
      // Set AI loading state
      setAiLoadingState({
        isGenerating: true,
        currentStep: 'Initializing generation...',
        progress: 10
      });
      
      // Include preferences with current week offset
      const enhancedPreferences = {
        ...dialogs.aiPreferences,
        weekOffset: navigation.currentWeekOffset,
        language,
        includeSnacks: dialogs.aiPreferences.includeSnacks, // Ensure this is passed
        mealsPerDay: dialogs.aiPreferences.includeSnacks ? 5 : 3
      };
      
      console.log('🍽️ Final preferences for generation:', enhancedPreferences);
      
      // Update loading steps during generation
      const updateProgress = (step: string, progress: number) => {
        setAiLoadingState(prev => ({
          ...prev,
          currentStep: step,
          progress
        }));
      };
      
      updateProgress('Analyzing your profile...', 25);
      
      // Start generation
      const result = await generateMealPlan(enhancedPreferences, { 
        weekOffset: navigation.currentWeekOffset 
      });
      
      if (result) {
        console.log('✅ Generation successful:', {
          weekOffset: navigation.currentWeekOffset,
          includeSnacks: enhancedPreferences.includeSnacks
        });
        
        updateProgress('Saving meal plan...', 75);
        
        // Invalidate queries and refetch
        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        // Wait for database update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateProgress('Finalizing...', 100);
        
        // Refetch data
        await refetchMealPlan?.();
        
        // Close dialog and clear loading state
        setTimeout(() => {
          closeAIDialog();
          setAiLoadingState({
            isGenerating: false,
            currentStep: '',
            progress: 0
          });
        }, 500);
        
        // Show success message
        const mealCount = enhancedPreferences.includeSnacks ? 5 : 3;
        toast.success(
          language === 'ar'
            ? `تم إنشاء خطة الوجبات بنجاح! (${mealCount} وجبات يومياً)`
            : `Meal plan generated successfully! (${mealCount} meals per day)`
        );
        
        return true;
      }
      
      throw new Error('Generation failed - no result returned');
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
          ? 'حدث خطأ أثناء الإنشاء. يرجى المحاولة مرة أخرى.'
          : 'An error occurred during generation. Please try again.'
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
    language,
    closeAIDialog
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
