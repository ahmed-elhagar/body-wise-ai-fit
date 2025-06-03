
import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from '@/hooks/meal-plan/useMealPlanNavigation';
import { useMealPlanCalculations } from '@/features/meal-plan/hooks/useMealPlanCalculations';
import { useMealPlanActions } from '@/hooks/useMealPlanActions';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { fetchMealPlanData } from '@/features/meal-plan/services/mealPlanService';
import type { DailyMeal } from '@/features/meal-plan/types';
import { formatWeekStartDate } from '@/utils/mealPlanUtils';

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

  // Enhanced refetch with better debugging
  const refetch = useCallback(async () => {
    const weekStartDateStr = formatWeekStartDate(currentWeekOffset);
    
    console.log('🔄 ENHANCED REFETCH TRIGGERED:', {
      weekOffset: currentWeekOffset,
      weekStartDate: weekStartDateStr,
      expectedWeekFromNav: weekStartDate?.toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    });
    
    try {
      // Invalidate current query
      await queryClient.invalidateQueries({
        queryKey: ['weekly-meal-plan', user?.id, currentWeekOffset],
      });
      
      // Force refetch
      const result = await originalRefetch();
      
      console.log('✅ REFETCH COMPLETED:', {
        hasResult: !!result.data,
        hasWeeklyPlan: !!result.data?.weeklyPlan,
        dailyMealsCount: result.data?.dailyMeals?.length || 0,
        weekStartDate: result.data?.weeklyPlan?.week_start_date
      });
      
      return result;
    } catch (error) {
      console.error('❌ REFETCH ERROR:', error);
      throw error;
    }
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

  // Enhanced week change handler with better synchronization
  const handleWeekChange = useCallback(async (newOffset: number) => {
    const oldWeekStartDate = formatWeekStartDate(currentWeekOffset);
    const newWeekStartDate = formatWeekStartDate(newOffset);
    
    console.log('📅 WEEK CHANGE:', {
      from: `offset ${currentWeekOffset} (${oldWeekStartDate})`,
      to: `offset ${newOffset} (${newWeekStartDate})`,
      timestamp: new Date().toISOString()
    });
    
    setCurrentWeekOffset(newOffset);
    
    // Preload the new week's data
    await queryClient.prefetchQuery({
      queryKey: ['weekly-meal-plan', user?.id, newOffset],
      queryFn: async () => {
        const result = await fetchMealPlanData(user?.id || '', newWeekStartDate);
        console.log('🔄 PRELOADED DATA FOR NEW WEEK:', {
          weekOffset: newOffset,
          weekStartDate: newWeekStartDate,
          hasData: !!result,
          timestamp: new Date().toISOString()
        });
        return result;
      },
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

  // Enhanced generation handler with week sync debugging
  const handleGenerateAIPlanEnhanced = useCallback(async () => {
    const weekStartDateStr = formatWeekStartDate(currentWeekOffset);
    
    console.log('🚀 STARTING ENHANCED AI GENERATION:', {
      weekOffset: currentWeekOffset,
      weekStartDate: weekStartDateStr,
      navWeekStartDate: weekStartDate?.toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    });
    
    // Include week offset in preferences
    const enhancedPreferences = {
      ...aiPreferences,
      weekOffset: currentWeekOffset,
    };
    
    // Update AI preferences to include current week
    updateAIPreferences({ weekOffset: currentWeekOffset });
    
    const result = await handleGenerateAIPlan();
    
    if (result) {
      console.log('✅ GENERATION SUCCESSFUL - REFRESHING DATA:', {
        weekOffset: currentWeekOffset,
        weekStartDate: weekStartDateStr,
        timestamp: new Date().toISOString()
      });
      
      // Wait for database consistency
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Force invalidate ALL meal plan queries
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === 'weekly-meal-plan' || 
                 query.queryKey[0] === 'optimized-meal-plan' ||
                 query.queryKey[0] === 'meal-plan';
        }
      });
      
      // Refetch current week data
      await refetch();
      
      // Final data verification
      setTimeout(() => {
        const currentData = queryClient.getQueryData(['weekly-meal-plan', user?.id, currentWeekOffset]);
        console.log('🔍 FINAL DATA VERIFICATION:', {
          hasData: !!currentData,
          weekOffset: currentWeekOffset,
          weekStartDate: weekStartDateStr,
          timestamp: new Date().toISOString()
        });
      }, 1000);
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
    
    // Enhanced actions
    refetch,
    handleGenerateAIPlan: handleGenerateAIPlanEnhanced,
    setCurrentWeekOffset: handleWeekChange,
    
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
