
import { useState } from 'react';
import type { DailyMeal, MealPlanPreferences } from '../types';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  
  // AI preferences with proper defaults
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  const openRecipeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const openExchangeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowExchangeDialog(true);
  };

  const openAddSnackDialog = () => {
    setShowAddSnackDialog(true);
  };

  return {
    // AI Dialog state
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    
    // Recipe Dialog state
    showRecipeDialog,
    setShowRecipeDialog,
    
    // Exchange Dialog state
    showExchangeDialog,
    setShowExchangeDialog,
    
    // Add Snack Dialog state
    showAddSnackDialog,
    setShowAddSnackDialog,
    
    // Selected meal state
    selectedMeal,
    setSelectedMeal,
    
    // Helper functions
    openRecipeDialog,
    openExchangeDialog,
    openAddSnackDialog
  };
};
