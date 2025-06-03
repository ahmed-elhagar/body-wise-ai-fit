
import React from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import MealPlanHeader from '@/components/meal-plan/components/MealPlanHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from '@/components/meal-plan/components/ErrorState';
import LoadingState from '@/components/meal-plan/components/LoadingState';
import MealPlanDialogs from '@/components/meal-plan/dialogs/MealPlanDialogs';
import MealPlanAILoadingDialog from '@/components/meal-plan/MealPlanAILoadingDialog';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();

  if (mealPlanState.error) {
    return <ErrorState error={mealPlanState.error} onRetry={mealPlanState.refetch} />;
  }

  if (mealPlanState.isLoading && !mealPlanState.currentWeekPlan) {
    return <LoadingState />;
  }

  // Extract today's meals for the selected day
  const todaysMeals = mealPlanState.currentWeekPlan?.dailyMeals?.filter(
    meal => meal.day_number === mealPlanState.selectedDayNumber
  ) || [];

  return (
    <>
      <div className="space-y-6">
        <MealPlanHeader 
          remainingCredits={mealPlanState.userCredits}
          onShowAIDialog={() => mealPlanState.openAIDialog()}
          isGenerating={mealPlanState.isGenerating}
        />
        
        <MealPlanNavigation 
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          onDayChange={mealPlanState.setSelectedDayNumber}
          weekStartDate={mealPlanState.weekStartDate}
        />
        
        <MealPlanContent
          viewMode="daily"
          currentWeekPlan={mealPlanState.currentWeekPlan}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          dailyMeals={mealPlanState.dailyMeals}
          totalCalories={mealPlanState.totalCalories}
          totalProtein={mealPlanState.totalProtein}
          targetDayCalories={mealPlanState.targetDayCalories}
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          isGenerating={mealPlanState.isGenerating}
          onViewMeal={(meal) => mealPlanState.openRecipeDialog(meal)}
          onExchangeMeal={(meal) => mealPlanState.openExchangeDialog(meal)}
          onAddSnack={() => mealPlanState.openAddSnackDialog()}
          onGenerateAI={() => mealPlanState.openAIDialog()}
          setCurrentWeekOffset={mealPlanState.setCurrentWeekOffset}
          setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
        />
      </div>

      {/* AI Loading Dialog - Step-by-step loading experience */}
      <MealPlanAILoadingDialog 
        isGenerating={mealPlanState.isGenerating}
        onClose={() => {}} // Can't be closed during generation
      />

      {/* All other dialogs */}
      <MealPlanDialogs
        showAIDialog={mealPlanState.showAIDialog}
        setShowAIDialog={mealPlanState.closeAIDialog}
        showRecipeDialog={mealPlanState.showRecipeDialog}
        setShowRecipeDialog={mealPlanState.closeRecipeDialog}
        showExchangeDialog={mealPlanState.showExchangeDialog}
        setShowExchangeDialog={mealPlanState.closeExchangeDialog}
        showAddSnackDialog={mealPlanState.showAddSnackDialog}
        setShowAddSnackDialog={mealPlanState.closeAddSnackDialog}
        showShoppingListDialog={mealPlanState.showShoppingListDialog}
        setShowShoppingListDialog={mealPlanState.closeShoppingListDialog}
        selectedMeal={mealPlanState.selectedMeal}
        selectedMealIndex={mealPlanState.selectedMealIndex}
        aiPreferences={mealPlanState.aiPreferences}
        setAiPreferences={mealPlanState.updateAIPreferences}
        handleGenerateAI={mealPlanState.handleGenerateAIPlan}
        onRefetch={mealPlanState.refetch}
        mealPlanData={mealPlanState.currentWeekPlan}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        weekStartDate={mealPlanState.weekStartDate}
      />
    </>
  );
};
