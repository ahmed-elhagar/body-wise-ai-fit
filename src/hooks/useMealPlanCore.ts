
import { useCallback, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanNavigation } from "./useMealPlanNavigation";
import { useMealPlanCalculations } from "./useMealPlanCalculations";
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
  
  // AI Loading state - separate from isGenerating to prevent hooks issues
  const [aiLoadingState, setAiLoadingState] = useState({
    isGenerating: false,
    currentStep: '',
    progress: 0
  });
  
  // Data fetching - single source of truth with proper error handling
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

  // Determine if we're actually loading (avoid infinite loading states)
  const isLoading = useMemo(() => {
    // If auth is still loading, wait
    if (authLoading) {
      console.log('🔄 Auth still loading...');
      return true;
    }
    
    // If no user, we're not loading (will redirect to auth)
    if (!user) {
      console.log('❌ No user found');
      return false;
    }
    
    // If data is loading and we haven't errored, show loading
    if (dataLoading && !isError) {
      console.log('🔄 Data loading...');
      return true;
    }
    
    return false;
  }, [authLoading, user, dataLoading, isError]);

  // Enhanced logging with better error tracking
  console.log('🔍 useMealPlanCore state:', {
    weekOffset: navigation.currentWeekOffset,
    selectedDay: navigation.selectedDayNumber,
    authLoading,
    dataLoading,
    isLoading,
    hasData: !!currentWeekPlan,
    hasError: !!error,
    errorMessage: error?.message,
    userId: user?.id?.substring(0, 8) + '...',
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan
  });

  // Manual refetch with enhanced error handling and retry logic
  const refetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered for week offset:', navigation.currentWeekOffset);
    
    if (!user?.id) {
      console.warn('⚠️ Cannot refetch without user ID');
      return;
    }
    
    try {
      await refetchMealPlan?.();
      console.log('✅ Manual refetch completed successfully');
    } catch (error) {
      console.error('❌ Manual refetch failed:', error);
      
      // Show user-friendly error message
      toast.error(
        language === 'ar' 
          ? 'فشل في تحديث البيانات. يرجى المحاولة مرة أخرى.' 
          : 'Failed to refresh data. Please try again.'
      );
    }
  }, [navigation.currentWeekOffset, refetchMealPlan, user?.id, language]);

  // Expose error recovery method
  const clearError = useCallback(() => {
    console.log('🧹 Clearing errors and retrying...');
    queryClient.removeQueries({ 
      queryKey: ['weekly-meal-plan', user?.id, navigation.currentWeekOffset] 
    });
    refetch();
  }, [queryClient, user?.id, navigation.currentWeekOffset, refetch]);

  return {
    // Navigation state
    ...navigation,
    
    // Calculations
    ...calculations,
    
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
    queryClient,
    authLoading
  };
};
