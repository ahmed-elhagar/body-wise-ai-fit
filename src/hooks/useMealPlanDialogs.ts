
import { useState } from "react";
import type { DailyMeal } from "@/hooks/useMealPlanData";

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

  console.log('🔧 useMealPlanDialogs: Current AI preferences:', aiPreferences);

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
    selectedMealIndex,
    setSelectedMealIndex
  };
};
