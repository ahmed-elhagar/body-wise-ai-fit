
import React from 'react';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { AddSnackDialog } from './dialogs/AddSnackDialog';
import { ExchangeDialog } from './dialogs/ExchangeDialog';
import { RecipeDialog } from './dialogs/RecipeDialog';
import ShoppingListDialog from '@/components/meal-plan/ShoppingListDialog';
import type { DailyMeal, MealPlanFetchResult, MealPlanPreferences } from '../types';

interface MealPlanDialogsProps {
  // AI Dialog
  showAIDialog: boolean;
  onCloseAIDialog: () => void;
  aiPreferences: MealPlanPreferences;
  onGenerateAI: (preferences: MealPlanPreferences) => Promise<void>;
  isGenerating: boolean;
  currentWeekOffset: number;

  // Add Snack Dialog
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  selectedDayNumber: number;
  totalCalories: number | null;
  targetDayCalories: number | null;
  weeklyPlanId: string | undefined;
  weekStartDate: Date;
  onSnackAdded: () => void;

  // Exchange Dialog
  showExchangeDialog: boolean;
  onCloseExchangeDialog: () => void;
  selectedMeal: DailyMeal | null;
  onMealExchanged: () => void;

  // Recipe Dialog
  showRecipeDialog: boolean;
  onCloseRecipeDialog: () => void;
  onRecipeUpdated: () => void;

  // Shopping List Dialog
  showShoppingListDialog: boolean;
  onCloseShoppingListDialog: () => void;
  enhancedShoppingItems: any[];
  onSendShoppingListEmail: () => Promise<boolean>;
}

export const MealPlanDialogs = ({
  showAIDialog,
  onCloseAIDialog,
  aiPreferences,
  onGenerateAI,
  isGenerating,
  currentWeekOffset,
  showAddSnackDialog,
  onCloseAddSnackDialog,
  selectedDayNumber,
  totalCalories,
  targetDayCalories,
  weeklyPlanId,
  weekStartDate,
  onSnackAdded,
  showExchangeDialog,
  onCloseExchangeDialog,
  selectedMeal,
  onMealExchanged,
  showRecipeDialog,
  onCloseRecipeDialog,
  onRecipeUpdated,
  showShoppingListDialog,
  onCloseShoppingListDialog,
  enhancedShoppingItems,
  onSendShoppingListEmail
}: MealPlanDialogsProps) => {
  return (
    <>
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={onCloseAIDialog}
        preferences={aiPreferences}
        onGenerate={onGenerateAI}
        isGenerating={isGenerating}
        weekOffset={currentWeekOffset}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        currentDayCalories={totalCalories || 0}
        targetDayCalories={targetDayCalories || 2000}
        selectedDay={selectedDayNumber}
        weeklyPlanId={weeklyPlanId}
        onSnackAdded={onSnackAdded}
        weekStartDate={weekStartDate}
      />

      <ExchangeDialog
        isOpen={showExchangeDialog}
        onClose={onCloseExchangeDialog}
        meal={selectedMeal}
        onMealExchanged={onMealExchanged}
      />

      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={onCloseRecipeDialog}
        meal={selectedMeal}
        onRecipeUpdated={onRecipeUpdated}
      />

      <ShoppingListDialog
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        shoppingItems={enhancedShoppingItems}
        weekStartDate={weekStartDate}
        onSendEmail={onSendShoppingListEmail}
      />
    </>
  );
};
