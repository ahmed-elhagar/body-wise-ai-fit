
import { useCallback, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "@/features/meal-plan/hooks/useMealPlanNavigation";
import { useMealPlanCalculations } from "@/features/meal-plan/hooks/useMealPlanCalculations";
import { useMealPlanData } from "./useMealPlanData";
import { useEnhancedMealPlan } from "./useEnhancedMealPlan";
import { useCreditSystem } from './useCreditSystem';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useMealPlanCore = () => {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { userCredits } = useCreditSystem();
  
  // Core navigation and UI state
  const navigation = useMealPlanNavigation();
  
  // AI Loading state
  const [aiLoadingState, setAiLoadingState] = useState({
    isGenerating: false,
    currentStep: '',
    progress: 0
  });
  
  // Data fetching with proper error handling
  const { 
    data: currentWeekPlan, 
    isLoading: dataLoading, 
    error, 
    refetch: refetchMealPlan,
    isError
  } = useMealPlanData(navigation.currentWeekOffset);
  
  // Enhanced meal plan generation
  const { 
    generateMealPlan, 
    isGenerating, 
    nutritionContext 
  } = useEnhancedMealPlan();
  
  // Calculations based on current data
  const calculations = useMealPlanCalculations(currentWeekPlan, navigation.selectedDayNumber);

  // Simplified loading state determination
  const isLoading = useMemo(() => {
    // If no user and auth is not loading, we're not loading (redirect will happen)
    if (!user && !authLoading) {
      return false;
    }
    
    // If auth is loading, show loading
    if (authLoading) {
      return true;
    }
    
    // If data is loading and no error, show loading
    if (dataLoading && !isError) {
      return true;
    }
    
    return false;
  }, [authLoading, user, dataLoading, isError]);

  console.log('🔍 useMealPlanCore simplified state:', {
    authLoading,
    hasUser: !!user,
    dataLoading,
    isLoading,
    isError,
    weekOffset: navigation.currentWeekOffset,
    calculationsKeys: Object.keys(calculations)
  });

  // Simplified refetch
  const refetch = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await refetchMealPlan?.();
    } catch (error) {
      console.error('❌ Refetch failed:', error);
      toast.error(
        language === 'ar' 
          ? 'فشل في تحديث البيانات' 
          : 'Failed to refresh data'
      );
    }
  }, [refetchMealPlan, user?.id, language]);

  // Clear error method
  const clearError = useCallback(() => {
    if (!user?.id) return;
    
    queryClient.removeQueries({ 
      queryKey: ['weekly-meal-plan', user.id, navigation.currentWeekOffset] 
    });
    refetch();
  }, [queryClient, user?.id, navigation.currentWeekOffset, refetch]);

  // Combine all state explicitly
  const coreState = {
    // Navigation state
    currentWeekOffset: navigation.currentWeekOffset,
    setCurrentWeekOffset: navigation.setCurrentWeekOffset,
    selectedDayNumber: navigation.selectedDayNumber,
    setSelectedDayNumber: navigation.setSelectedDayNumber,
    weekStartDate: navigation.weekStartDate,
    
    // Calculations - spread all calculation properties explicitly
    dailyMeals: calculations.dailyMeals,
    todaysMeals: calculations.todaysMeals,
    totalCalories: calculations.totalCalories,
    totalProtein: calculations.totalProtein,
    targetDayCalories: calculations.targetDayCalories,
    
    // Data
    currentWeekPlan,
    isLoading,
    isGenerating: aiLoadingState.isGenerating || isGenerating,
    error,
    isError,
    
    // AI Loading state
    aiLoadingState,
    setAiLoadingState,
    
    // Enhanced context
    nutritionContext,
    userCredits,
    generateMealPlan,
    
    // Actions
    refetch,
    clearError,
    
    // Core properties
    user,
    language,
    authLoading
  };

  console.log('🔍 useMealPlanCore final state keys:', Object.keys(coreState));

  return coreState;
};
