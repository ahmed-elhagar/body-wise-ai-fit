
import { useState } from "react";
import type { Meal } from "@/types/meal";

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
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
    
    // Selected meal state
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex
  };
};
