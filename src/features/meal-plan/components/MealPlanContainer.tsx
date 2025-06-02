
import React from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { UnifiedNavigation } from './navigation/UnifiedNavigation';
import { DayOverview } from './DayOverview';
import { EmptyWeekState } from './EmptyWeekState';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { AddSnackDialog } from './dialogs/AddSnackDialog';
import { ExchangeDialog } from './dialogs/ExchangeDialog';
import { RecipeDialog } from './dialogs/RecipeDialog';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
import type { DailyMeal } from '@/hooks/meal-plan/types';

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
    isLoading,
    error,
    
    // Calculations
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Dialogs
    showAIDialog,
    setShowAIDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    selectedMeal,
    aiPreferences,
    setAiPreferences,
    
    // Actions
    isGenerating,
    handleGenerateAIPlan,
    handleViewMeal,
    handleExchangeMeal,
    refetch
  } = useMealPlanPage();

  const handleAddSnack = () => {
    setShowAddSnackDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoadingIndicator
          status="loading"
          type="general"
          message="Loading meal plan..."
          variant="card"
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading meal plan</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Navigation */}
      <UnifiedNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        weekStartDate={weekStartDate}
        onGenerateAI={() => setShowAIDialog(true)}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
        remainingCredits={5}
      />

      {/* Main Content */}
      {currentWeekPlan?.weeklyPlan ? (
        <DayOverview
          selectedDayNumber={selectedDayNumber}
          dailyMeals={dailyMeals}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          onViewMeal={handleViewMeal}
          onExchangeMeal={handleExchangeMeal}
          onAddSnack={handleAddSnack}
          weekStartDate={weekStartDate}
          weeklyPlan={currentWeekPlan}
        />
      ) : (
        <EmptyWeekState
          onGenerateAI={() => setShowAIDialog(true)}
          isGenerating={isGenerating}
        />
      )}

      {/* Dialogs */}
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        preferences={aiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
        weekOffset={currentWeekOffset}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => setShowAddSnackDialog(false)}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={refetch}
      />

      <ExchangeDialog
        isOpen={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        meal={selectedMeal as DailyMeal | null}
        onMealExchanged={refetch}
      />

      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
        meal={selectedMeal as DailyMeal | null}
      />
    </div>
  );
};
