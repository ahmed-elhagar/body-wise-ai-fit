
import { useState } from 'react';
import { useMealPlanCore } from './useMealPlanCore';
import { useMealPlanDialogs } from './useMealPlanDialogs';

export const useMealPlanState = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);

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

  return {
    ...coreState,
    ...dialogState,
    viewMode,
    isGenerating,
    setViewMode,
    handleAddSnack,
    handleGenerateAI,
    handleShuffle,
    switchToDaily,
    switchToWeekly,
  };
};
