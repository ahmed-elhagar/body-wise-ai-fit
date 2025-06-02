
import React from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { UnifiedNavigation } from './navigation/UnifiedNavigation';
import { DayOverview } from './DayOverview';
import { EmptyWeekState } from './EmptyWeekState';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { AddSnackDialog } from './dialogs/AddSnackDialog';
import { ExchangeDialog } from './dialogs/ExchangeDialog';
import { RecipeDialog } from './dialogs/RecipeDialog';
import { CompactDailyProgress } from './CompactDailyProgress';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
import type { DailyMeal } from '@/hooks/useMealPlanData';

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
    
    // Dialog states
    showAIDialog,
    showAddSnackDialog,
    showExchangeDialog,
    showRecipeDialog,
    selectedMeal,
    aiPreferences,
    
    // Dialog actions
    openAIDialog,
    closeAIDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openRecipeDialog,
    closeRecipeDialog,
    
    // Main actions
    isGenerating,
    handleGenerateAIPlan,
    handleViewMeal,
    handleExchangeMeal,
    handleAddSnack,
    refetch,
    
    // Credit system
    userCredits
  } = useMealPlanPage();

  console.log('🏠 MEAL PLAN CONTAINER STATE:', {
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    dailyMealsCount: dailyMeals?.length || 0,
    isLoading,
    isGenerating,
    selectedDayNumber,
    currentWeekOffset,
    userCredits,
    dialogStates: {
      showAIDialog,
      showRecipeDialog,
      showExchangeDialog,
      showAddSnackDialog
    }
  });

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
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Navigation */}
      <UnifiedNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        weekStartDate={weekStartDate}
        onGenerateAI={openAIDialog}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
        remainingCredits={userCredits || 0}
      />

      {/* Only show compact daily progress at the top */}
      {currentWeekPlan?.weeklyPlan && (
        <CompactDailyProgress
          totalCalories={totalCalories || 0}
          totalProtein={totalProtein || 0}
          targetDayCalories={targetDayCalories || 2000}
        />
      )}

      {/* Main Content */}
      {currentWeekPlan?.weeklyPlan ? (
        <DayOverview
          selectedDayNumber={selectedDayNumber}
          dailyMeals={dailyMeals || []}
          totalCalories={totalCalories || 0}
          totalProtein={totalProtein || 0}
          targetDayCalories={targetDayCalories || 2000}
          onViewMeal={handleViewMeal}
          onExchangeMeal={handleExchangeMeal}
          onAddSnack={handleAddSnack}
          weekStartDate={weekStartDate}
          weeklyPlan={currentWeekPlan}
          showAddSnackButton={true}
        />
      ) : (
        <EmptyWeekState
          onGenerateAI={openAIDialog}
          isGenerating={isGenerating}
        />
      )}

      {/* Dialogs */}
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={closeAIDialog}
        preferences={aiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
        weekOffset={currentWeekOffset}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={closeAddSnackDialog}
        currentDayCalories={totalCalories || 0}
        targetDayCalories={targetDayCalories || 2000}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={refetch}
      />

      <ExchangeDialog
        isOpen={showExchangeDialog}
        onClose={closeExchangeDialog}
        meal={selectedMeal as DailyMeal | null}
        onMealExchanged={refetch}
      />

      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={closeRecipeDialog}
        meal={selectedMeal as DailyMeal | null}
      />
    </div>
  );
};
