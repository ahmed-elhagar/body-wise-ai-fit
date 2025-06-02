
import React from 'react';
import MealPlanAIDialog from '@/components/meal-plan/MealPlanAIDialog';
import MealRecipeDialog from '@/components/meal-plan/MealRecipeDialog';
import MealExchangeDialog from '@/components/meal-plan/MealExchangeDialog';
import EnhancedAddSnackDialog from '@/components/meal-plan/EnhancedAddSnackDialog';
import type { DailyMeal, MealPlanFetchResult } from '../types';

interface MealPlanDialogsProps {
  showAIDialog: boolean;
  showRecipeDialog: boolean;
  showExchangeDialog: boolean;
  showAddSnackDialog: boolean;
  selectedMeal: DailyMeal | null;
  selectedMealIndex: number;
  aiPreferences: any;
  isGenerating: boolean;
  aiLoadingState?: {
    isGenerating: boolean;
    currentStep: string;
    progress: number;
  };
  onCloseAIDialog: () => void;
  onCloseRecipeDialog: () => void;
  onCloseExchangeDialog: () => void;
  onCloseAddSnackDialog: () => void;
  onUpdateAIPreferences: (preferences: any) => void;
  onGenerateAIPlan: () => void;
  onRefetch: () => void;
  currentWeekPlan: MealPlanFetchResult | null;
  selectedDayNumber: number;
}

export const MealPlanDialogs = ({
  showAIDialog,
  showRecipeDialog,
  showExchangeDialog,
  showAddSnackDialog,
  selectedMeal,
  selectedMealIndex,
  aiPreferences,
  isGenerating,
  aiLoadingState,
  onCloseAIDialog,
  onCloseRecipeDialog,
  onCloseExchangeDialog,
  onCloseAddSnackDialog,
  onUpdateAIPreferences,
  onGenerateAIPlan,
  onRefetch,
  currentWeekPlan,
  selectedDayNumber
}: MealPlanDialogsProps) => {
  return (
    <>
      {/* AI Generation Dialog - Only show when not generating (loading dialog handles that) */}
      {!isGenerating && (
        <MealPlanAIDialog
          open={showAIDialog}
          onOpenChange={onCloseAIDialog}
          preferences={aiPreferences}
          onPreferencesChange={onUpdateAIPreferences}
          onGenerate={onGenerateAIPlan}
          isGenerating={isGenerating}
          aiLoadingState={aiLoadingState}
        />
      )}

      {/* Recipe Dialog */}
      <MealRecipeDialog
        isOpen={showRecipeDialog}
        onClose={onCloseRecipeDialog}
        meal={selectedMeal}
      />

      {/* Exchange Dialog - Fix props to match component interface */}
      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={onCloseExchangeDialog}
        meal={selectedMeal}
        mealIndex={selectedMealIndex}
        onMealExchanged={onRefetch}
      />

      {/* Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={onRefetch}
        currentDayCalories={0} // Will be calculated in the dialog
        targetDayCalories={2000} // Will be calculated in the dialog
      />
    </>
  );
};
