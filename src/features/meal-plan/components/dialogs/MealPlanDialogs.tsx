
import React from 'react';
import MealRecipeDialog from "@/components/MealRecipeDialog";
import MealExchangeDialog from "@/components/meal-plan/MealExchangeDialog";
import EnhancedAddSnackDialog from "@/components/meal-plan/EnhancedAddSnackDialog";
import MealPlanAIDialog from "../MealPlanAIDialog";
import EnhancedShoppingListDrawer from "@/components/shopping-list/EnhancedShoppingListDrawer";
import type { DailyMeal, MealPlanPreferences, MealPlanFetchResult } from '../../types';

interface MealPlanDialogsProps {
  showAIDialog: boolean;
  onCloseAIDialog: () => void;
  aiPreferences: MealPlanPreferences;
  onGenerateAI: () => Promise<boolean>;
  isGenerating: boolean;
  currentWeekOffset: number;
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  selectedDayNumber: number;
  totalCalories: number;
  targetDayCalories: number;
  weeklyPlanId?: string;
  weekStartDate: Date;
  onSnackAdded: () => void;
  showExchangeDialog: boolean;
  onCloseExchangeDialog: () => void;
  selectedMeal: DailyMeal | null;
  onMealExchanged: () => void;
  showRecipeDialog: boolean;
  onCloseRecipeDialog: () => void;
  onRecipeUpdated: () => void;
  showShoppingListDialog: boolean;
  onCloseShoppingListDialog: () => void;
  enhancedShoppingItems: any[];
  onSendShoppingListEmail: () => Promise<boolean>;
  userCredits: any;
  hasWeeklyPlan: boolean;
  isEmailLoading: boolean;
  currentWeekPlan: MealPlanFetchResult | null;
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
  onSendShoppingListEmail,
  userCredits,
  hasWeeklyPlan,
  isEmailLoading,
  currentWeekPlan
}: MealPlanDialogsProps) => {
  return (
    <>
      {/* AI Generation Dialog */}
      <MealPlanAIDialog
        open={showAIDialog}
        onOpenChange={onCloseAIDialog}
        preferences={aiPreferences}
        onGenerate={onGenerateAI}
        isGenerating={isGenerating}
      />

      {/* Recipe Dialog */}
      {selectedMeal && (
        <MealRecipeDialog
          isOpen={showRecipeDialog}
          onClose={onCloseRecipeDialog}
          meal={selectedMeal}
          onRecipeGenerated={onRecipeUpdated}
        />
      )}

      {/* Exchange Dialog */}
      {selectedMeal && (
        <MealExchangeDialog
          isOpen={showExchangeDialog}
          onClose={onCloseExchangeDialog}
          currentMeal={selectedMeal}
          onExchange={onMealExchanged}
        />
      )}

      {/* Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        weeklyPlanId={weeklyPlanId}
        onSnackAdded={onSnackAdded}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
      />

      {/* Shopping List Dialog */}
      <EnhancedShoppingListDrawer
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        weeklyPlan={currentWeekPlan}
        weekId={weeklyPlanId}
        onShoppingListUpdate={onSnackAdded}
      />
    </>
  );
};
