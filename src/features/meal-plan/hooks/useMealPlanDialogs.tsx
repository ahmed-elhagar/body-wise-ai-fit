
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
  
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  // Create a setDialogs function for backward compatibility
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
      
      setShowAIDialog(newState.showAIDialog);
      setShowRecipeDialog(newState.showRecipeDialog);
      setShowExchangeDialog(newState.showExchangeDialog);
      setShowAddSnackDialog(newState.showAddSnackDialog);
      setShowShoppingListDialog(newState.showShoppingListDialog);
      setSelectedMeal(newState.selectedMeal);
      setSelectedMealIndex(newState.selectedMealIndex);
      setAiPreferences(newState.aiPreferences);
    }
  };

  // Dialog actions
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
  
  const openExchangeDialog = (meal: DailyMeal, index = 0) => {
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

  const handleAddSnack = () => setShowAddSnackDialog(true);

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
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    aiPreferences,
    setAiPreferences,
    
    // Backward compatibility
    setDialogs,
    
    // Actions
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
    handleAddSnack
  };
};
