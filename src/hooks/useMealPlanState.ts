import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from '@/hooks/meal-plan/useMealPlanNavigation';
import { useMealPlanCalculations } from '@/features/meal-plan/hooks/useMealPlanCalculations';
import { useMealPlanActions } from '@/hooks/useMealPlanActions';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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

  // Enhanced refetch that invalidates all related queries and clears cache
  const refetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch - invalidating all meal plan queries for week offset:', currentWeekOffset);
    console.log('🗓️ Expected week start date from navigation:', weekStartDate?.toISOString().split('T')[0]);
    
    // Clear all caches first
    await queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === 'weekly-meal-plan' || 
               query.queryKey[0] === 'optimized-meal-plan' ||
               query.queryKey[0] === 'meal-plan';
      }
    });
    
    // Also clear the OptimizedMealPlanService cache
    const { OptimizedMealPlanService } = await import('@/features/meal-plan/services/optimizedMealPlanService');
    OptimizedMealPlanService.clearCache();
    
    // Force refetch the current data
    return await originalRefetch();
  }, [queryClient, user?.id, currentWeekOffset, originalRefetch, weekStartDate]);

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

  // Enhanced week change handler with better cache management
  const handleWeekChange = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    
    // Clear cache for the new week to ensure fresh data
    await queryClient.invalidateQueries({
      queryKey: ['weekly-meal-plan', user?.id, newOffset]
    });
    
    setCurrentWeekOffset(newOffset);
    
    // Preload the new week's data with cache busting
    await queryClient.prefetchQuery({
      queryKey: ['weekly-meal-plan', user?.id, newOffset],
      staleTime: 0 // Force fresh fetch
    });
  }, [currentWeekOffset, setCurrentWeekOffset, queryClient, user?.id]);

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

  // Enhanced generation handler with better week sync and debugging
  const handleGenerateAIPlanEnhanced = useCallback(async () => {
    console.log('🚀 Starting enhanced AI generation for week offset:', currentWeekOffset);
    console.log('🗓️ Week start date for generation:', weekStartDate?.toISOString().split('T')[0]);
    
    // Include week offset in preferences
    const enhancedPreferences = {
      ...aiPreferences,
      weekOffset: currentWeekOffset,
    };
    
    // Update AI preferences to include current week
    updateAIPreferences({ weekOffset: currentWeekOffset });
    
    const result = await handleGenerateAIPlan();
    
    if (result) {
      console.log('✅ Generation successful, forcing refresh for week:', currentWeekOffset);
      console.log('🗓️ Expected data for week starting:', weekStartDate?.toISOString().split('T')[0]);
      
      // Wait longer for the database to be updated since there might be a sync issue
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Force invalidate ALL meal plan queries to ensure fresh data
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === 'weekly-meal-plan' || 
                 query.queryKey[0] === 'optimized-meal-plan' ||
                 query.queryKey[0] === 'meal-plan';
        }
      });
      
      // Clear the service cache too
      const { OptimizedMealPlanService } = await import('@/features/meal-plan/services/optimizedMealPlanService');
      OptimizedMealPlanService.clearCache();
      
      // Refetch the current week data
      await refetch();
      
      // Additional debug: check if data exists now
      const currentData = queryClient.getQueryData(['weekly-meal-plan', user?.id, currentWeekOffset]);
      console.log('🔍 Data after refetch:', currentData ? 'Found' : 'Still missing');
    }
    
    return result;
  }, [aiPreferences, currentWeekOffset, handleGenerateAIPlan, updateAIPreferences, queryClient, user?.id, refetch, weekStartDate]);

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
