
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
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  
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

  // Enhanced shopping list functionality
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(currentWeekPlan);

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

  const handleShuffleMeals = async () => {
    if (currentWeekPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(currentWeekPlan.weeklyPlan.id);
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleShowShoppingList = () => {
    setShowShoppingListDialog(true);
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
        onGenerateAI={openAIDialog}
        onShuffle={handleShuffleMeals}
        onShowShoppingList={handleShowShoppingList}
        isGenerating={isGenerating}
        isShuffling={isShuffling}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* Navigation */}
      <MealPlanNavigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentWeekOffset={currentWeekOffset}
        onWeekOffsetChange={setCurrentWeekOffset}
        selectedDayNumber={selectedDayNumber}
        onDayChange={setSelectedDayNumber}
        weekStartDate={weekStartDate}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

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
        onViewMeal={handleViewMeal}
        onExchangeMeal={handleExchangeMeal}
        onAddSnack={handleAddSnack}
        onGenerateAI={openAIDialog}
        setCurrentWeekOffset={setCurrentWeekOffset}
        setSelectedDayNumber={setSelectedDayNumber}
      />

      {/* Dialogs */}
      <MealPlanDialogs
        showAIDialog={showAIDialog}
        onCloseAIDialog={closeAIDialog}
        aiPreferences={aiPreferences}
        onGenerateAI={handleGenerateAIPlan}
        isGenerating={isGenerating}
        currentWeekOffset={currentWeekOffset}
        showAddSnackDialog={showAddSnackDialog}
        onCloseAddSnackDialog={closeAddSnackDialog}
        selectedDayNumber={selectedDayNumber}
        totalCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        weekStartDate={weekStartDate}
        onSnackAdded={refetch}
        showExchangeDialog={showExchangeDialog}
        onCloseExchangeDialog={closeExchangeDialog}
        selectedMeal={selectedMeal as DailyMeal | null}
        onMealExchanged={refetch}
        showRecipeDialog={showRecipeDialog}
        onCloseRecipeDialog={closeRecipeDialog}
        onRecipeUpdated={refetch}
        showShoppingListDialog={showShoppingListDialog}
        onCloseShoppingListDialog={() => setShowShoppingListDialog(false)}
        enhancedShoppingItems={enhancedShoppingItems.items}
        onSendShoppingListEmail={handleSendShoppingListEmail}
      />
    </div>
  );
};
