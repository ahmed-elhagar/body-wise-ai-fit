import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from '@/hooks/meal-plan/useMealPlanNavigation';
import { useMealPlanCalculations } from '@/features/meal-plan/hooks/useMealPlanCalculations';
import { useMealPlanActions } from '@/hooks/useMealPlanActions';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();
  
  // Navigation state
  const {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
  } = useMealPlanNavigation();

  // Core meal plan data
  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch: originalRefetch,
  } = useMealPlanData(currentWeekOffset);

  // Enhanced refetch that properly invalidates and refreshes data
  const refetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch - invalidating all meal plan queries for week offset:', currentWeekOffset);
    console.log('🗓️ Expected week start date from navigation:', weekStartDate?.toISOString().split('T')[0]);
    
    // Clear all meal plan related caches
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey[0] === 'weekly-meal-plan' || 
               queryKey[0] === 'optimized-meal-plan' ||
               queryKey[0] === 'meal-plan';
      }
    });
    
    // Clear the OptimizedMealPlanService cache
    try {
      const { OptimizedMealPlanService } = await import('@/features/meal-plan/services/optimizedMealPlanService');
      OptimizedMealPlanService.clearCache();
    } catch (e) {
      console.log('Service cache clear skipped:', e);
    }
    
    // Force refetch current data
    const result = await originalRefetch();
    
    // Wait a bit and try again if no data
    if (!result.data?.weeklyPlan) {
      console.log('⏳ No data returned, waiting and retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await originalRefetch();
    }
    
    return result;
  }, [queryClient, currentWeekOffset, originalRefetch, weekStartDate]);

  // Calculations
  const {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
  } = useMealPlanCalculations(currentWeekPlan, selectedDayNumber);

  // Dialog states
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  // Selected items
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);

  // AI preferences state
  const [aiPreferences, setAiPreferences] = useState({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner",
  });

  // Actions
  const { handleGenerateAIPlan, isGenerating } = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    aiPreferences,
    refetch
  );

  // Enhanced week change handler
  const handleWeekChange = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    setCurrentWeekOffset(newOffset);
  }, [currentWeekOffset, setCurrentWeekOffset]);

  // Dialog handlers
  const openAIDialog = useCallback(() => setShowAIDialog(true), []);
  const closeAIDialog = useCallback(() => setShowAIDialog(false), []);
  
  const openRecipeDialog = useCallback((meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, []);
  const closeRecipeDialog = useCallback(() => {
    setSelectedMeal(null);
    setShowRecipeDialog(false);
  }, []);

  const openExchangeDialog = useCallback((meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowExchangeDialog(true);
  }, []);
  const closeExchangeDialog = useCallback(() => {
    setSelectedMeal(null);
    setShowExchangeDialog(false);
  }, []);

  const openAddSnackDialog = useCallback(() => setShowAddSnackDialog(true), []);
  const closeAddSnackDialog = useCallback(() => setShowAddSnackDialog(false), []);

  const openShoppingListDialog = useCallback(() => setShowShoppingListDialog(true), []);
  const closeShoppingListDialog = useCallback(() => setShowShoppingListDialog(false), []);

  const updateAIPreferences = useCallback((newPrefs: any) => {
    setAiPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  // Enhanced generation handler with better data refresh
  const handleGenerateAIPlanEnhanced = useCallback(async () => {
    console.log('🚀 Starting enhanced AI generation for week offset:', currentWeekOffset);
    
    const enhancedPreferences = {
      ...aiPreferences,
      weekOffset: currentWeekOffset,
    };
    
    updateAIPreferences({ weekOffset: currentWeekOffset });
    
    const result = await handleGenerateAIPlan();
    
    if (result) {
      console.log('✅ Generation successful, starting enhanced refresh for week:', currentWeekOffset);
      
      // Wait longer for database to fully commit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced refresh sequence
      await refetch();
      
      // Double check - if still no data, try one more time
      const currentData = queryClient.getQueryData(['weekly-meal-plan', user?.id, currentWeekOffset]);
      if (!currentData?.weeklyPlan) {
        console.log('⚠️ Still no data, final retry...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refetch();
      }
    }
    
    return result;
  }, [aiPreferences, currentWeekOffset, handleGenerateAIPlan, updateAIPreferences, queryClient, user?.id, refetch]);

  return {
    // Data
    currentWeekPlan,
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset: handleWeekChange,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Loading states
    isLoading,
    error,
    isGenerating,
    
    // Centralized credits
    userCredits,
    isPro,
    hasCredits,
    
    // Dialog states
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    showShoppingListDialog,
    
    // Selected items
    selectedMeal,
    selectedMealIndex,
    
    // AI preferences
    aiPreferences,
    updateAIPreferences,
    
    // Actions
    refetch,
    handleGenerateAIPlan: handleGenerateAIPlanEnhanced,
    
    // Dialog handlers
    openAIDialog,
    closeAIDialog,
    openRecipeDialog,
    closeRecipeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    openShoppingListDialog,
    closeShoppingListDialog,
  };
};
