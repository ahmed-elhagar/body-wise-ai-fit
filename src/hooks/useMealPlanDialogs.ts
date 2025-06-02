
import { useState } from "react";
import type { DailyMeal } from "./useMealPlanData";

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  
  // AI preferences with proper defaults
  const [aiPreferences, setAiPreferences] = useState({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  // Dialog action handlers
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
    setSelectedMealIndex(0);
  };
  
  const openAddSnackDialog = () => setShowAddSnackDialog(true);
  const closeAddSnackDialog = () => setShowAddSnackDialog(false);

  console.log('🔧 useMealPlanDialogs: Dialog states:', {
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    selectedMeal: selectedMeal?.name || null,
    aiPreferences
  });

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
    
    // Selected items
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    
    // AI preferences
    aiPreferences,
    setAiPreferences,
    
    // Action handlers
    openAIDialog,
    closeAIDialog,
    openRecipeDialog,
    closeRecipeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openAddSnackDialog,
    closeAddSnackDialog
  };
};
