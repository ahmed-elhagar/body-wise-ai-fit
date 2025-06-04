
import React from 'react';
import { useMealPlanCore } from '@/hooks/useMealPlanCore';
import { useMealPlanDialogs } from '@/features/meal-plan/hooks/useMealPlanDialogs';
import { useMealPlanHandlers } from '@/hooks/useMealPlanHandlers';
import { MealPlanContent } from './MealPlanContent';
import { MealExchangeDialog } from '@/components/meal-plan/MealExchangeDialog';
import MealRecipeDialog from '@/components/MealRecipeDialog';
import { LoadingState } from './LoadingState';
import ErrorState from '../../../components/meal-plan/components/ErrorState';

export const MealPlanContainer = () => {
  const {
    currentWeekPlan,
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    weekStartDate,
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    isGenerating,
    error,
    generateMealPlan,
    refetch,
    hasCredits
  } = useMealPlanCore();

  const {
    showExchangeDialog,
    selectedMeal,
    openExchangeDialog,
    closeExchangeDialog,
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    openRecipeDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    aiPreferences,
    closeAllDialogs
  } = useMealPlanDialogs();

  const { handleExchangeMeal, handleViewMeal } = useMealPlanHandlers(
    (meal) => {
      console.log('👁️ Viewing meal details:', meal.name);
      openRecipeDialog(meal);
    },
    openExchangeDialog
  );

  const handleMealExchanged = () => {
    refetch();
    closeExchangeDialog();
  };

  const handleGenerateAI = () => {
    return generateMealPlan(aiPreferences);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <MealPlanContent
        viewMode="daily"
        currentWeekPlan={currentWeekPlan}
        selectedDayNumber={selectedDayNumber}
        dailyMeals={dailyMeals}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        targetDayCalories={targetDayCalories}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        isGenerating={isGenerating}
        onViewMeal={handleViewMeal}
        onExchangeMeal={handleExchangeMeal}
        onAddSnack={() => {}}
        onGenerateAI={handleGenerateAI}
        setCurrentWeekOffset={setCurrentWeekOffset}
        setSelectedDayNumber={setSelectedDayNumber}
      />

      {/* Enhanced Meal Exchange Dialog */}
      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={closeExchangeDialog}
        meal={selectedMeal}
        onExchangeComplete={handleMealExchanged}
      />

      {/* Recipe Dialog */}
      {selectedMeal && (
        <MealRecipeDialog
          isOpen={showRecipeDialog}
          onClose={() => setShowRecipeDialog(false)}
          meal={selectedMeal}
          onRecipeGenerated={refetch}
        />
      )}
    </div>
  );
};
