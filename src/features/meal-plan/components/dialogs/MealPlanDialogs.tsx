
import React from 'react';
import { AIGenerationDialog } from './AIGenerationDialog';
import { EnhancedAddSnackDialog } from '@/components/meal-plan/EnhancedAddSnackDialog';
import { MealPlanExchangeDialog } from '@/components/meal-plan/MealPlanExchangeDialog';
import { EnhancedRecipeDialog } from '@/components/meal-plan/EnhancedRecipeDialog';
import { ShoppingListDialog } from '@/components/meal-plan/ShoppingListDialog';
import type { DailyMeal, MealPlanPreferences } from '@/types/mealPlan';

interface MealPlanDialogsProps {
  // AI Dialog
  showAIDialog: boolean;
  onCloseAIDialog: () => void;
  aiPreferences: MealPlanPreferences;
  onGenerateAI: () => Promise<boolean>;
  isGenerating: boolean;
  currentWeekOffset: number;
  
  // Add Snack Dialog
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  selectedDayNumber: number;
  totalCalories: number;
  targetDayCalories: number;
  weeklyPlanId?: string;
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
  
  // Additional props
  userCredits: number;
  hasWeeklyPlan: boolean;
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
  hasWeeklyPlan
}: MealPlanDialogsProps) => {
  return (
    <>
      <AIGenerationDialog
        open={showAIDialog}
        onClose={onCloseAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={() => {}} // This should be handled by the parent
        onGenerate={onGenerateAI}
        isGenerating={isGenerating}
        userCredits={userCredits}
        hasExistingPlan={hasWeeklyPlan}
      />

      <EnhancedAddSnackDialog
        open={showAddSnackDialog}
        onOpenChange={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        currentCalories={totalCalories}
        targetCalories={targetDayCalories}
        weeklyPlanId={weeklyPlanId}
        weekStartDate={weekStartDate}
        onSnackAdded={onSnackAdded}
      />

      <MealPlanExchangeDialog
        open={showExchangeDialog}
        onOpenChange={onCloseExchangeDialog}
        meal={selectedMeal}
        onMealExchanged={onMealExchanged}
      />

      <EnhancedRecipeDialog
        open={showRecipeDialog}
        onOpenChange={onCloseRecipeDialog}
        meal={selectedMeal}
        onRecipeUpdated={onRecipeUpdated}
      />

      <ShoppingListDialog
        open={showShoppingListDialog}
        onOpenChange={onCloseShoppingListDialog}
        shoppingItems={enhancedShoppingItems}
        onSendEmail={onSendShoppingListEmail}
      />
    </>
  );
};
