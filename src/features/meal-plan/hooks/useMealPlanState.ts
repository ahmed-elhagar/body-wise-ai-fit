
import { useState } from 'react';
import { useMealPlanCore } from './useMealPlanCore';
import { useMealPlanDialogs } from './useMealPlanDialogs';

export const useMealPlanState = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({
    duration: "7",
    cuisine: "mixed", 
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner",
  });

  const coreState = useMealPlanCore();
  const dialogState = useMealPlanDialogs();

  const handleAddSnack = (dayNumber?: number) => {
    console.log('Adding snack for day:', dayNumber || coreState.selectedDayNumber);
    // Add snack logic here
  };

  const handleGenerateAI = () => {
    dialogState.handleShowAI();
  };

  const handleShuffle = () => {
    setIsGenerating(true);
    // Add shuffle logic here
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const switchToDaily = () => {
    setViewMode('daily');
  };

  const switchToWeekly = () => {
    setViewMode('weekly');
  };

  const updateAIPreferences = (newPrefs: any) => {
    setAiPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const handleShowShoppingList = () => {
    dialogState.handleShowShoppingList();
  };

  return {
    ...coreState,
    ...dialogState,
    viewMode,
    isGenerating,
    aiPreferences,
    setViewMode,
    handleAddSnack,
    handleGenerateAI,
    handleShuffle,
    switchToDaily,
    switchToWeekly,
    updateAIPreferences,
    handleShowShoppingList,
  };
};
