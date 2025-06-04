
import { useState, useCallback } from 'react';
import type { DailyMeal, MealPlanPreferences } from '../types';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  
  // AI preferences with proper defaults and validation
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  // Optimized dialog action methods with useCallback
  const openAIDialog = useCallback(() => setShowAIDialog(true), []);
  const closeAIDialog = useCallback(() => setShowAIDialog(false), []);
  
  const openRecipeDialog = useCallback((meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, []);
  
  const closeRecipeDialog = useCallback(() => {
    setShowRecipeDialog(false);
    setSelectedMeal(null);
  }, []);

  const openExchangeDialog = useCallback((meal: DailyMeal, index: number = 0) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  }, []);
  
  const closeExchangeDialog = useCallback(() => {
    setShowExchangeDialog(false);
    setSelectedMeal(null);
  }, []);

  const openAddSnackDialog = useCallback(() => setShowAddSnackDialog(true), []);
  const closeAddSnackDialog = useCallback(() => setShowAddSnackDialog(false), []);

  const openShoppingListDialog = useCallback(() => setShowShoppingListDialog(true), []);
  const closeShoppingListDialog = useCallback(() => setShowShoppingListDialog(false), []);

  const updateAIPreferences = useCallback((newPreferences: MealPlanPreferences) => {
    // Validate preferences before setting
    if (newPreferences && typeof newPreferences === 'object') {
      setAiPreferences(prev => ({ ...prev, ...newPreferences }));
    } else {
      console.error('Invalid AI preferences provided:', newPreferences);
    }
  }, []);

  const handleAddSnack = useCallback(() => {
    setShowAddSnackDialog(true);
  }, []);

  // Optimized bulk dialog state setter
  const setDialogs = useCallback((updater: any) => {
    if (typeof updater === 'function') {
      try {
        const currentState = {
          showAIDialog,
          showRecipeDialog,
          showExchangeDialog,
          showAddSnackDialog,
          showShoppingListDialog,
          selectedMeal,
          selectedMealIndex,
          aiPreferences
        };
        
        const newState = updater(currentState);
        
        // Batch state updates for better performance
        if (newState.showAIDialog !== undefined) setShowAIDialog(newState.showAIDialog);
        if (newState.showRecipeDialog !== undefined) setShowRecipeDialog(newState.showRecipeDialog);
        if (newState.showExchangeDialog !== undefined) setShowExchangeDialog(newState.showExchangeDialog);
        if (newState.showAddSnackDialog !== undefined) setShowAddSnackDialog(newState.showAddSnackDialog);
        if (newState.showShoppingListDialog !== undefined) setShowShoppingListDialog(newState.showShoppingListDialog);
        if (newState.selectedMeal !== undefined) setSelectedMeal(newState.selectedMeal);
        if (newState.selectedMealIndex !== undefined) setSelectedMealIndex(newState.selectedMealIndex);
        if (newState.aiPreferences !== undefined) setAiPreferences(newState.aiPreferences);
      } catch (error) {
        console.error('Error updating dialog state:', error);
      }
    }
  }, [showAIDialog, showRecipeDialog, showExchangeDialog, showAddSnackDialog, showShoppingListDialog, selectedMeal, selectedMealIndex, aiPreferences]);

  // Close all dialogs helper
  const closeAllDialogs = useCallback(() => {
    setShowAIDialog(false);
    setShowRecipeDialog(false);
    setShowExchangeDialog(false);
    setShowAddSnackDialog(false);
    setShowShoppingListDialog(false);
    setSelectedMeal(null);
  }, []);

  return {
    // Dialog states
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    
    // Selected items
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    
    // AI preferences
    aiPreferences,
    setAiPreferences,
    
    // Optimized action methods
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
    updateAIPreferences,
    handleAddSnack,
    closeAllDialogs,
    
    // Backward compatibility
    setDialogs
  };
};
