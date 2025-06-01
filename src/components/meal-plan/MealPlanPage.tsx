
import { useState } from "react";
import MealPlanPageLayout from "./MealPlanPageLayout";
import MealPlanContent from "./MealPlanContent";
import MealPlanDialogsContainer from "./MealPlanDialogsContainer";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";

const MealPlanPage = () => {
  const mealPlanData = useMealPlanPage();

  return (
    <MealPlanPageLayout>
      <MealPlanContent
        onShowAIDialog={() => mealPlanData.setShowAIDialog(true)}
        onShowAddSnackDialog={() => mealPlanData.setShowAddSnackDialog(true)}
        onShowShoppingListDialog={() => mealPlanData.setShowShoppingListDialog(true)}
      />
      
      <MealPlanDialogsContainer
        currentWeekPlan={mealPlanData.currentWeekPlan}
        selectedDayNumber={mealPlanData.selectedDayNumber}
        totalCalories={mealPlanData.totalCalories}
        targetDayCalories={mealPlanData.targetDayCalories}
        shoppingItems={mealPlanData.shoppingItems}
        selectedMeal={mealPlanData.selectedMeal}
        showAIDialog={mealPlanData.showAIDialog}
        setShowAIDialog={mealPlanData.setShowAIDialog}
        showAddSnackDialog={mealPlanData.showAddSnackDialog}
        setShowAddSnackDialog={mealPlanData.setShowAddSnackDialog}
        showShoppingListDialog={mealPlanData.showShoppingListDialog}
        setShowShoppingListDialog={mealPlanData.setShowShoppingListDialog}
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
