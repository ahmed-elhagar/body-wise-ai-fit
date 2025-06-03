
import React from 'react';
import { MealPlanAIDialog } from '@/components/meal-plan/MealPlanAIDialog';
import { MealPlanRecipeDialog } from '@/components/meal-plan/MealPlanRecipeDialog';
import { MealPlanExchangeDialog } from '@/components/meal-plan/MealPlanExchangeDialog';
import { EnhancedAddSnackDialog } from '@/components/meal-plan/EnhancedAddSnackDialog';
import { ShoppingListDialog } from '@/components/meal-plan/ShoppingListDialog';
import type { DailyMeal, MealPlanFetchResult } from '../types';

interface MealPlanDialogsProps {
  showAIDialog: boolean;
  closeAIDialog: () => void;
  showRecipeDialog: boolean;
  closeRecipeDialog: () => void;
  showExchangeDialog: boolean;
  closeExchangeDialog: () => void;
  showAddSnackDialog: boolean;
  closeAddSnackDialog: () => void;
  showShoppingListDialog: boolean;
  closeShoppingListDialog: () => void;
  selectedMeal: DailyMeal | null;
  aiPreferences: any;
  updateAIPreferences: (prefs: any) => void;
  handleGenerateAIPlan: () => Promise<boolean>;
  isGenerating: boolean;
  currentWeekPlan: MealPlanFetchResult | null;
  selectedDayNumber: number;
  refetch: () => void;
}

export const MealPlanDialogs = ({
  showAIDialog,
  closeAIDialog,
  showRecipeDialog,
  closeRecipeDialog,
  showExchangeDialog,
  closeExchangeDialog,
  showAddSnackDialog,
  closeAddSnackDialog,
  showShoppingListDialog,
  closeShoppingListDialog,
  selectedMeal,
  aiPreferences,
  updateAIPreferences,
  handleGenerateAIPlan,
  isGenerating,
  currentWeekPlan,
  selectedDayNumber,
  refetch
}: MealPlanDialogsProps) => {
  return (
    <>
      <MealPlanAIDialog
        open={showAIDialog}
        onOpenChange={closeAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={updateAIPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
      />

      <MealPlanRecipeDialog
        open={showRecipeDialog}
        onOpenChange={closeRecipeDialog}
        meal={selectedMeal}
        onRecipeGenerated={refetch}
      />

      <MealPlanExchangeDialog
        open={showExchangeDialog}
        onOpenChange={closeExchangeDialog}
        meal={selectedMeal}
        onMealExchanged={refetch}
      />

      <EnhancedAddSnackDialog
        open={showAddSnackDialog}
        onOpenChange={closeAddSnackDialog}
        weeklyPlan={currentWeekPlan}
        selectedDayNumber={selectedDayNumber}
        onSnackAdded={refetch}
      />

      <ShoppingListDialog
        open={showShoppingListDialog}
        onOpenChange={closeShoppingListDialog}
        weeklyPlan={currentWeekPlan}
      />
    </>
  );
};
