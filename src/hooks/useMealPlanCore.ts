
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

export const useMealPlanCore = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
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
    
    // Calculations
    ...calculations,
    
    // Data
    currentWeekPlan,
    isLoading,
    isGenerating: aiLoadingState.isGenerating || isGenerating,
    error,
    
    // AI Loading state
    aiLoadingState,
    setAiLoadingState,
    
    // Enhanced context
    nutritionContext,
    userCredits,
    generateMealPlan,
    
    // Actions
    refetch,
    
    // Core properties
    user,
    language,
    queryClient
  };
};
