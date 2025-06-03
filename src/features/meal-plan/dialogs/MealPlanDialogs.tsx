
import React from 'react';
import { AIGenerationDialog } from '@/features/meal-plan/components/dialogs/AIGenerationDialog';
import { EnhancedRecipeDialog } from '@/components/meal-plan/EnhancedRecipeDialog';
import MealPlanExchangeDialog from '@/components/meal-plan/MealPlanExchangeDialog';
import EnhancedAddSnackDialog from '@/components/meal-plan/EnhancedAddSnackDialog';
import ShoppingListDialog from '@/components/meal-plan/ShoppingListDialog';
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
      <AIGenerationDialog
        open={showAIDialog}
        onClose={closeAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={updateAIPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
        userCredits={5}
        hasExistingPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {selectedMeal && (
        <EnhancedRecipeDialog
          isOpen={showRecipeDialog}
          onClose={closeRecipeDialog}
          meal={selectedMeal}
        />
      )}

      {selectedMeal && (
        <MealPlanExchangeDialog
          open={showExchangeDialog}
          onOpenChange={closeExchangeDialog}
          meal={selectedMeal}
          mealIndex={0}
        />
      )}

      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={closeAddSnackDialog}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={refetch}
        currentDayCalories={0}
        targetDayCalories={2000}
      />

      <ShoppingListDialog
        isOpen={showShoppingListDialog}
        onClose={closeShoppingListDialog}
        shoppingItems={{
          items: [],
          groupedItems: {}
        }}
        onSendEmail={async () => false}
        weekStartDate={new Date()}
        isLoading={false}
      />
    </>
  );
};
