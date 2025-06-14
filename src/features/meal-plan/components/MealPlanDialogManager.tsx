
import React from 'react';
import { MealExchangeDialog } from './dialogs/MealExchangeDialog';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { EnhancedRecipeDialog } from './EnhancedRecipeDialog';
import EnhancedAddSnackDialog from './dialogs/EnhancedAddSnackDialog';
import ModernShoppingListDrawer from '@/components/shopping-list/ModernShoppingListDrawer';
import { MealPlanAILoadingDialog } from './dialogs/MealPlanAILoadingDialog';

const MealPlanDialogManager = ({ mealPlanState, hasExistingPlan }: { mealPlanState: any, hasExistingPlan: boolean }) => {
  return (
    <>
      {/* AI Loading Dialog - Step-by-step loading experience */}
      <MealPlanAILoadingDialog 
        isGenerating={mealPlanState.isGenerating}
        onClose={() => mealPlanState.refetch()}
        position="top-right"
      />

      {/* Modern Shopping List Drawer */}
      <ModernShoppingListDrawer
        isOpen={mealPlanState.showShoppingListDialog}
        onClose={() => mealPlanState.closeShoppingListDialog()}
        weeklyPlan={mealPlanState.currentWeekPlan}
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={() => {
          console.log('🛒 Shopping list updated');
          mealPlanState.refetch();
        }}
      />

      {/* AI Generation Dialog */}
      <AIGenerationDialog
        open={mealPlanState.showAIDialog}
        onClose={() => mealPlanState.closeAIDialog()}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.updateAIPreferences}
        onGenerate={mealPlanState.handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
        hasExistingPlan={hasExistingPlan}
      />

      {/* Enhanced Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={mealPlanState.showAddSnackDialog}
        onClose={() => mealPlanState.closeAddSnackDialog()}
        selectedDay={mealPlanState.selectedDayNumber}
        currentDayCalories={mealPlanState.totalCalories}
        targetDayCalories={mealPlanState.targetDayCalories}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={() => mealPlanState.refetch()}
      />

      {/* Enhanced Meal Exchange Dialog */}
      <MealExchangeDialog
        isOpen={mealPlanState.showExchangeDialog}
        onClose={() => mealPlanState.closeExchangeDialog()}
        meal={mealPlanState.selectedMeal}
        onExchangeComplete={() => {
          mealPlanState.refetch();
          mealPlanState.closeExchangeDialog();
        }}
      />

      {/* Enhanced Recipe Dialog */}
      <EnhancedRecipeDialog
        isOpen={mealPlanState.showRecipeDialog}
        onClose={() => mealPlanState.closeRecipeDialog()}
        meal={mealPlanState.selectedMeal}
        onRecipeUpdated={() => mealPlanState.refetch()}
      />
    </>
  );
};

export default MealPlanDialogManager;
