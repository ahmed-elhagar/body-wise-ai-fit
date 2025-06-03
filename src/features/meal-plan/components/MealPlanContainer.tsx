
import React from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { RevampedMealPlanNavigation } from '@/components/meal-plan/RevampedMealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from '../dialogs/MealPlanDialogs';
import { MealPlanLoadingStates } from '@/components/meal-plan/MealPlanLoadingStates';
import EnhancedMealPlanHeader from '@/components/meal-plan/EnhancedMealPlanHeader';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();

  console.log('🚀 MEAL PLAN CONTAINER - DEBUG:', {
    currentWeekOffset: mealPlanState.currentWeekOffset,
    weekStartDate: mealPlanState.weekStartDate.toDateString(),
    hasWeeklyPlan: !!mealPlanState.currentWeekPlan?.weeklyPlan,
    selectedDay: mealPlanState.selectedDayNumber,
    isLoading: mealPlanState.isLoading,
    isGenerating: mealPlanState.isGenerating
  });

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingStates isLoading={mealPlanState.isLoading} isGenerating={mealPlanState.isGenerating} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary-25 via-white to-fitness-accent-25">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Enhanced Header with Actions */}
          <EnhancedMealPlanHeader
            onGenerateAI={mealPlanState.handleGenerateAIPlan}
            onShuffle={() => {
              // TODO: Implement shuffle functionality
              console.log('Shuffle meals');
            }}
            onShowShoppingList={mealPlanState.openShoppingListDialog}
            onRegeneratePlan={mealPlanState.handleGenerateAIPlan}
            isGenerating={mealPlanState.isGenerating}
            hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
          />

          {/* Navigation */}
          <RevampedMealPlanNavigation
            weekStartDate={mealPlanState.weekStartDate}
            currentWeekOffset={mealPlanState.currentWeekOffset}
            onWeekChange={mealPlanState.setCurrentWeekOffset}
            selectedDayNumber={mealPlanState.selectedDayNumber}
            onDayChange={mealPlanState.setSelectedDayNumber}
          />

          {/* Content */}
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
            onViewMeal={mealPlanState.openRecipeDialog}
            onExchangeMeal={mealPlanState.openExchangeDialog}
            onAddSnack={mealPlanState.openAddSnackDialog}
            onGenerateAI={mealPlanState.handleGenerateAIPlan}
            setCurrentWeekOffset={mealPlanState.setCurrentWeekOffset}
            setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
          />

          {/* Dialogs */}
          <MealPlanDialogs
            showAIDialog={mealPlanState.showAIDialog}
            closeAIDialog={mealPlanState.closeAIDialog}
            showRecipeDialog={mealPlanState.showRecipeDialog}
            closeRecipeDialog={mealPlanState.closeRecipeDialog}
            showExchangeDialog={mealPlanState.showExchangeDialog}
            closeExchangeDialog={mealPlanState.closeExchangeDialog}
            showAddSnackDialog={mealPlanState.showAddSnackDialog}
            closeAddSnackDialog={mealPlanState.closeAddSnackDialog}
            showShoppingListDialog={mealPlanState.showShoppingListDialog}
            closeShoppingListDialog={mealPlanState.closeShoppingListDialog}
            selectedMeal={mealPlanState.selectedMeal}
            aiPreferences={mealPlanState.aiPreferences}
            updateAIPreferences={mealPlanState.updateAIPreferences}
            handleGenerateAIPlan={mealPlanState.handleGenerateAIPlan}
            isGenerating={mealPlanState.isGenerating}
            currentWeekPlan={mealPlanState.currentWeekPlan}
            selectedDayNumber={mealPlanState.selectedDayNumber}
            refetch={mealPlanState.refetch}
          />
        </div>
      </div>
    </div>
  );
};
