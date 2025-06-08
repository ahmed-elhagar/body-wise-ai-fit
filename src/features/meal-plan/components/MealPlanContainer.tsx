
import React, { useState } from 'react';
import { useMealPlanPage } from '../hooks/useMealPlanPage';
import { useMealPlanDialogs } from '../hooks/useMealPlanDialogs';
import MealPlanHeader from './MealPlanHeader';
import { UnifiedNavigation } from './navigation/UnifiedNavigation';
import { MealPlanContent } from './MealPlanContent';
import { ViewModeToggle } from './ViewModeToggle';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

export const MealPlanContainer = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  // Use the unified meal plan page hook
  const {
    currentWeekPlan,
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    isLoading,
    error,
    isGenerating,
    userCredits,
    hasCredits,
    handleGenerateAIPlan,
    refetch
  } = useMealPlanPage();

  // Use the dialog management hook
  const {
    openRecipeDialog,
    openExchangeDialog,
    openAddSnackDialog,
    openShoppingListDialog
  } = useMealPlanDialogs();

  // Handle shuffle action (placeholder for now)
  const handleShuffle = async () => {
    console.log('🔄 Shuffle meals functionality');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 via-white to-fitness-accent-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <MealPlanHeader
          onGenerateAI={handleGenerateAIPlan}
          onShuffle={handleShuffle}
          onShowShoppingList={openShoppingListDialog}
          onRegeneratePlan={handleGenerateAIPlan}
          isGenerating={isGenerating}
          hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
        />

        {/* Navigation */}
        <UnifiedNavigation
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={setSelectedDayNumber}
          weekStartDate={weekStartDate}
          onGenerateAI={handleGenerateAIPlan}
          isGenerating={isGenerating}
          hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
          remainingCredits={userCredits}
        />

        {/* View Mode Toggle */}
        {currentWeekPlan?.weeklyPlan && (
          <div className="flex justify-center">
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        )}

        {/* Main Content */}
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
          onGenerateAI={handleGenerateAIPlan}
          setCurrentWeekOffset={setCurrentWeekOffset}
          setSelectedDayNumber={setSelectedDayNumber}
        />
      </div>
    </div>
  );
};
