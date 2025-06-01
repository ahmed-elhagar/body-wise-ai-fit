import { useState } from "react";
import MealPlanPageLayout from "./MealPlanPageLayout";
import MealPlanContent from "./MealPlanContent";
import MealPlanDialogsContainer from "./MealPlanDialogsContainer";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";

const MealPlanPage = () => {
  const mealPlanData = useMealPlanPage();
  
  // Add state management for dialogs
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  return (
    <MealPlanPageLayout>
      <MealPlanContent
        onShowAIDialog={() => setShowAIDialog(true)}
        onShowAddSnackDialog={() => setShowAddSnackDialog(true)}
        onShowShoppingListDialog={() => setShowShoppingListDialog(true)}
      />
      
      <MealPlanDialogsContainer
        // ... keep existing code (all props from mealPlanData)
        currentWeekPlan={mealPlanData.currentWeekPlan}
        selectedDayNumber={mealPlanData.selectedDayNumber}
        totalCalories={mealPlanData.totalCalories}
        targetDayCalories={mealPlanData.targetDayCalories}
        shoppingItems={mealPlanData.shoppingItems}
        selectedMeal={mealPlanData.selectedMeal}
        showAIDialog={showAIDialog}
        setShowAIDialog={setShowAIDialog}
        showAddSnackDialog={showAddSnackDialog}
        setShowAddSnackDialog={setShowAddSnackDialog}
        showShoppingListDialog={showShoppingListDialog}
        setShowShoppingListDialog={setShowShoppingListDialog}
        showRecipeDialog={mealPlanData.showRecipeDialog}
        setShowRecipeDialog={mealPlanData.setShowRecipeDialog}
        showExchangeDialog={mealPlanData.showExchangeDialog}
        setShowExchangeDialog={mealPlanData.setShowExchangeDialog}
        aiPreferences={mealPlanData.aiPreferences}
        setAiPreferences={mealPlanData.setAiPreferences}
        selectedMealIndex={mealPlanData.selectedMealIndex}
        handleRecipeGenerated={mealPlanData.handleRecipeGenerated}
        isGenerating={mealPlanData.isGenerating}
      />
    </MealPlanPageLayout>
  );
};

export default MealPlanPage;
