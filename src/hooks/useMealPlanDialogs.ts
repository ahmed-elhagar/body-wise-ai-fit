
import { useState } from "react";
import type { Meal } from "@/types/meal";

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);
  const [aiPreferences, setAiPreferences] = useState({
    duration: '7',
    cuisine: 'mixed',
    maxPrepTime: '45',
    mealTypes: 'all',
    includeSnacks: true
  });

  return {
    showAIDialog,
    setShowAIDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    aiPreferences,
    setAiPreferences
  };
};
