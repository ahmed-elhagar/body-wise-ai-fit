
import { useState, useCallback } from 'react';
import type { DailyMeal } from '../types';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);

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

  return {
    // Dialog states
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    showShoppingListDialog,
    
    // Selected items
    selectedMeal,
    selectedMealIndex,
    
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
