
import { useState } from "react";
import type { DailyMeal } from "@/hooks/useMealPlanData";

export interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
}

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    mealTypes: "breakfast,lunch,dinner"
  });

  return {
    showAIDialog,
    setShowAIDialog,
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
