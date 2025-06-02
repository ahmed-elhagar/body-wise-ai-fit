
import React from 'react';
import { AIGenerationDialog } from './AIGenerationDialog';
import EnhancedAddSnackDialog from '@/components/meal-plan/EnhancedAddSnackDialog';
import MealExchangeDialog from '@/components/MealExchangeDialog';
import { EnhancedRecipeDialog } from '@/components/meal-plan/EnhancedRecipeDialog';
import ShoppingListDialog from '@/components/ShoppingListDialog';
import { useEnhancedShoppingList } from '@/hooks/useEnhancedShoppingList';
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
  isEmailLoading: boolean;
  
  // Add current week plan data
  currentWeekPlan?: any;
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
  // Use the actual current week plan data for shopping list
  const { enhancedShoppingItems: shoppingListData } = useEnhancedShoppingList(currentWeekPlan);

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
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        weeklyPlanId={weeklyPlanId}
        onSnackAdded={onSnackAdded}
      />

      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={onCloseExchangeDialog}
        currentMeal={selectedMeal}
        onExchange={onMealExchanged}
      />

      <EnhancedRecipeDialog
        isOpen={showRecipeDialog}
        onClose={onCloseRecipeDialog}
        meal={selectedMeal}
        onRecipeUpdated={onRecipeUpdated}
      />

      <ShoppingListDialog
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        shoppingItems={shoppingListData}
        onSendEmail={onSendShoppingListEmail}
        weekStartDate={weekStartDate}
        isLoading={isEmailLoading}
      />
    </>
  );
};
