
import { useState } from 'react';
import type { DailyMeal, MealPlanPreferences } from '../types';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  
  // AI preferences with proper defaults
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  // Dialog action methods
  const openAIDialog = () => setShowAIDialog(true);
  const closeAIDialog = () => setShowAIDialog(false);
  
  const openRecipeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };
  const closeRecipeDialog = () => {
    setShowRecipeDialog(false);
    setSelectedMeal(null);
  };

  const openExchangeDialog = (meal: DailyMeal, index: number = 0) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  };
  const closeExchangeDialog = () => {
    setShowExchangeDialog(false);
    setSelectedMeal(null);
  };

  const openAddSnackDialog = () => setShowAddSnackDialog(true);
  const closeAddSnackDialog = () => setShowAddSnackDialog(false);

  const openShoppingListDialog = () => setShowShoppingListDialog(true);
  const closeShoppingListDialog = () => setShowShoppingListDialog(false);

  const updateAIPreferences = (newPreferences: MealPlanPreferences) => {
    setAiPreferences(newPreferences);
  };

  const handleAddSnack = () => {
    setShowAddSnackDialog(true);
  };

  // Unified state setter for backward compatibility
  const setDialogs = (updater: any) => {
    if (typeof updater === 'function') {
      const newState = updater({
        showAIDialog,
        showRecipeDialog,
        showExchangeDialog,
        showAddSnackDialog,
        showShoppingListDialog,
        selectedMeal,
        selectedMealIndex,
        aiPreferences
      });
      
      if (newState.showAIDialog !== undefined) setShowAIDialog(newState.showAIDialog);
      if (newState.showRecipeDialog !== undefined) setShowRecipeDialog(newState.showRecipeDialog);
      if (newState.showExchangeDialog !== undefined) setShowExchangeDialog(newState.showExchangeDialog);
      if (newState.showAddSnackDialog !== undefined) setShowAddSnackDialog(newState.showAddSnackDialog);
      if (newState.showShoppingListDialog !== undefined) setShowShoppingListDialog(newState.showShoppingListDialog);
      if (newState.selectedMeal !== undefined) setSelectedMeal(newState.selectedMeal);
      if (newState.selectedMealIndex !== undefined) setSelectedMealIndex(newState.selectedMealIndex);
      if (newState.aiPreferences !== undefined) setAiPreferences(newState.aiPreferences);
    }
  };

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
    
    // Action methods
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
    
    // Backward compatibility
    setDialogs
  };
};
