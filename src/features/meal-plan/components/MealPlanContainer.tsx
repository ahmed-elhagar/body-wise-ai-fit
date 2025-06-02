import React, { useState } from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { MealPlanPageHeader } from './MealPlanPageHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './MealPlanDialogs';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { useEnhancedShoppingList } from '@/hooks/useEnhancedShoppingList';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
import type { DailyMeal } from '@/features/meal-plan/types';

export const MealPlanContainer = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  
  const mealPlanState = useMealPlanPage();
  
  // Enhanced shopping list functionality
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(mealPlanState.currentWeekPlan);

  if (mealPlanState.isLoading) {
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

  if (mealPlanState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading meal plan</h3>
          <p className="text-gray-600">{mealPlanState.error.message}</p>
          <button 
            onClick={mealPlanState.refetch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleShuffleMeals = async () => {
    if (mealPlanState.currentWeekPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(mealPlanState.currentWeekPlan.weeklyPlan.id);
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleSendShoppingListEmail = async (): Promise<boolean> => {
    try {
      return await sendShoppingListEmail();
    } catch (error) {
      console.error('Failed to send shopping list email:', error);
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <MealPlanPageHeader
        onGenerateAI={mealPlanState.openAIDialog}
        onShuffle={handleShuffleMeals}
        onShowShoppingList={() => mealPlanState.setDialogs?.(prev => ({ ...prev, showShoppingListDialog: true }))}
        isGenerating={mealPlanState.isGenerating}
        isShuffling={isShuffling}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
      />

      {/* Navigation */}
      <MealPlanNavigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        onWeekOffsetChange={mealPlanState.setCurrentWeekOffset}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        onDayChange={mealPlanState.setSelectedDayNumber}
        weekStartDate={mealPlanState.weekStartDate}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
      />

      {/* Main Content */}
      <MealPlanContent
        viewMode={viewMode}
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
        onAddSnack={mealPlanState.handleAddSnack}
        onGenerateAI={mealPlanState.openAIDialog}
        setCurrentWeekOffset={mealPlanState.setCurrentWeekOffset}
        setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
      />

      {/* Enhanced Dialogs */}
      <MealPlanDialogs
        showAIDialog={mealPlanState.showAIDialog}
        onCloseAIDialog={mealPlanState.closeAIDialog}
        aiPreferences={mealPlanState.aiPreferences}
        onGenerateAI={mealPlanState.handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        showAddSnackDialog={mealPlanState.showAddSnackDialog}
        onCloseAddSnackDialog={mealPlanState.closeAddSnackDialog}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        totalCalories={mealPlanState.totalCalories}
        targetDayCalories={mealPlanState.targetDayCalories}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        weekStartDate={mealPlanState.weekStartDate}
        onSnackAdded={mealPlanState.refetch}
        showExchangeDialog={mealPlanState.showExchangeDialog}
        onCloseExchangeDialog={mealPlanState.closeExchangeDialog}
        selectedMeal={mealPlanState.selectedMeal}
        onMealExchanged={mealPlanState.refetch}
        showRecipeDialog={mealPlanState.showRecipeDialog}
        onCloseRecipeDialog={mealPlanState.closeRecipeDialog}
        onRecipeUpdated={mealPlanState.refetch}
        showShoppingListDialog={mealPlanState.showShoppingListDialog || false}
        onCloseShoppingListDialog={() => mealPlanState.setDialogs?.(prev => ({ ...prev, showShoppingListDialog: false }))}
        enhancedShoppingItems={enhancedShoppingItems.items}
        onSendShoppingListEmail={handleSendShoppingListEmail}
        userCredits={mealPlanState.userCredits}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
      />
    </div>
  );
};
