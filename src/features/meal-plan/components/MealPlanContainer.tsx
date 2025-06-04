import React from 'react';
import { useMealPlanCore } from '@/hooks/useMealPlanCore';
import { useMealPlanDialogs } from '@/hooks/meal-plan/useMealPlanDialogs';
import { useMealPlanHandlers } from '@/hooks/useMealPlanHandlers';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './dialogs/MealPlanDialogs';
import { MealExchangeDialog } from '@/components/meal-plan/MealExchangeDialog';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

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
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    aiPreferences,
    openRecipeDialog,
    closeAllDialogs
  } = useMealPlanDialogs();

  const { handleExchangeMeal, handleViewMeal } = useMealPlanHandlers(
    (meal) => {
      // Handle view meal
      console.log('View meal:', meal);
    },
    openExchangeDialog
  );

  const handleMealExchanged = () => {
    refetch();
    closeExchangeDialog();
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
        onGenerateAI={generateMealPlan}
        setCurrentWeekOffset={setCurrentWeekOffset}
        setSelectedDayNumber={setSelectedDayNumber}
      />

      {/* New Enhanced Meal Exchange Dialog */}
      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={closeExchangeDialog}
        meal={selectedMeal}
        onExchangeComplete={handleMealExchanged}
      />

      {/* Other dialogs... */}
    </div>
  );
};
