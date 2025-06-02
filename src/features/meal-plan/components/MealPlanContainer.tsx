
import React from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { MealPlanHeader } from './MealPlanHeader';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './MealPlanDialogs';
import { MealPlanAILoadingDialog } from '@/components/meal-plan/MealPlanAILoadingDialog';

export const MealPlanContainer = () => {
  const {
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Data
    currentWeekPlan,
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    error,
    
    // AI State
    isGenerating,
    aiLoadingState,
    
    // Dialog states
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    selectedMeal,
    selectedMealIndex,
    aiPreferences,
    
    // Actions
    openAIDialog,
    closeAIDialog,
    openRecipeDialog,
    closeRecipeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    updateAIPreferences,
    handleGenerateAIPlan,
    refetch
  } = useMealPlanState();

  const [viewMode, setViewMode] = React.useState<'daily' | 'weekly'>('daily');

  console.log('🎯 MealPlanContainer render:', {
    isGenerating,
    aiLoadingState,
    showAIDialog,
    currentWeekPlan: !!currentWeekPlan,
    error: !!error
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <MealPlanHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onGenerateAI={openAIDialog}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
        isGenerating={isGenerating}
      />

      <MealPlanContent
        viewMode={viewMode}
        currentWeekPlan={currentWeekPlan}
        selectedDayNumber={selectedDayNumber}
        dailyMeals={dailyMeals}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        targetDayCalories={targetDayCalories}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        isGenerating={isGenerating}
        onViewMeal={openRecipeDialog}
        onExchangeMeal={openExchangeDialog}
        onAddSnack={openAddSnackDialog}
        onGenerateAI={openAIDialog}
        setCurrentWeekOffset={setCurrentWeekOffset}
        setSelectedDayNumber={setSelectedDayNumber}
      />

      {/* AI Loading Dialog - Show when generating */}
      <MealPlanAILoadingDialog
        isGenerating={isGenerating}
        onClose={closeAIDialog}
      />

      {/* All other dialogs */}
      <MealPlanDialogs
        showAIDialog={showAIDialog}
        showRecipeDialog={showRecipeDialog}
        showExchangeDialog={showExchangeDialog}
        showAddSnackDialog={showAddSnackDialog}
        selectedMeal={selectedMeal}
        selectedMealIndex={selectedMealIndex}
        aiPreferences={aiPreferences}
        isGenerating={isGenerating}
        aiLoadingState={aiLoadingState}
        onCloseAIDialog={closeAIDialog}
        onCloseRecipeDialog={closeRecipeDialog}
        onCloseExchangeDialog={closeExchangeDialog}
        onCloseAddSnackDialog={closeAddSnackDialog}
        onUpdateAIPreferences={updateAIPreferences}
        onGenerateAIPlan={handleGenerateAIPlan}
        onRefetch={refetch}
        currentWeekPlan={currentWeekPlan}
        selectedDayNumber={selectedDayNumber}
      />
    </div>
  );
};
