
import React from 'react';
import MealPlanDialogs from '../MealPlanDialogs';

interface MealPlanDialogsContainerProps {
  currentWeekPlan: any;
  selectedDayNumber: number;
  totalCalories: number;
  targetDayCalories: number;
  shoppingItems: any[];
  selectedMeal: any;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  showAddSnackDialog: boolean;
  setShowAddSnackDialog: (show: boolean) => void;
  showShoppingListDialog: boolean;
  setShowShoppingListDialog: (show: boolean) => void;
  showRecipeDialog: boolean;
  setShowRecipeDialog: (show: boolean) => void;
  showExchangeDialog: boolean;
  setShowExchangeDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (preferences: any) => void;
  selectedMealIndex: number;
  handleRecipeGenerated: () => void;
  isGenerating?: boolean;
}

const MealPlanDialogsContainer = ({
  currentWeekPlan,
  selectedDayNumber,
  totalCalories,
  targetDayCalories,
  shoppingItems,
  selectedMeal,
  showAIDialog,
  setShowAIDialog,
  showAddSnackDialog,
  setShowAddSnackDialog,
  showShoppingListDialog,
  setShowShoppingListDialog,
  showRecipeDialog,
  setShowRecipeDialog,
  showExchangeDialog,
  setShowExchangeDialog,
  aiPreferences,
  setAiPreferences,
  selectedMealIndex,
  handleRecipeGenerated,
  isGenerating = false
}: MealPlanDialogsContainerProps) => {
  
  const handleGenerateAI = () => {
    console.log('Generate AI meal plan');
  };

  const handleSnackAdded = () => {
    console.log('Snack added');
  };

  const handleExchange = () => {
    console.log('Exchange meal');
  };

  return (
    <MealPlanDialogs
      showAIDialog={showAIDialog}
      onCloseAIDialog={() => setShowAIDialog(false)}
      aiPreferences={aiPreferences}
      onPreferencesChange={setAiPreferences}
      onGenerateAI={handleGenerateAI}
      isGenerating={isGenerating}
      showAddSnackDialog={showAddSnackDialog}
      onCloseAddSnackDialog={() => setShowAddSnackDialog(false)}
      selectedDay={selectedDayNumber}
      weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
      onSnackAdded={handleSnackAdded}
      currentDayCalories={totalCalories}
      targetDayCalories={targetDayCalories}
      showShoppingListDialog={showShoppingListDialog}
      onCloseShoppingListDialog={() => setShowShoppingListDialog(false)}
      shoppingItems={shoppingItems}
      showRecipeDialog={showRecipeDialog}
      onCloseRecipeDialog={() => setShowRecipeDialog(false)}
      selectedMeal={selectedMeal}
      showExchangeDialog={showExchangeDialog}
      onCloseExchangeDialog={() => setShowExchangeDialog(false)}
      selectedMealIndex={selectedMealIndex}
      onExchange={handleExchange}
      onRecipeGenerated={handleRecipeGenerated}
    />
  );
};

export default MealPlanDialogsContainer;
