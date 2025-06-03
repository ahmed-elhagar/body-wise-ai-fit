
import React from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import MealPlanHeader from '@/components/meal-plan/MealPlanHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from '@/components/meal-plan/components/ErrorState';
import LoadingState from '@/components/meal-plan/components/LoadingState';
import MealPlanDialogs from '@/components/meal-plan/dialogs/MealPlanDialogs';
import MealPlanAILoadingDialog from '@/components/meal-plan/MealPlanAILoadingDialog';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import ShoppingListDrawer from '@/components/shopping-list/ShoppingListDrawer';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();

  // Enhanced shuffle handler
  const handleShuffle = async () => {
    if (!mealPlanState.currentWeekPlan?.weeklyPlan?.id) {
      console.error('❌ No weekly plan ID available for shuffle');
      return;
    }
    
    console.log('🔄 Starting enhanced shuffle for plan:', mealPlanState.currentWeekPlan.weeklyPlan.id);
    const success = await shuffleMeals(mealPlanState.currentWeekPlan.weeklyPlan.id);
    
    if (success) {
      // Refetch the meal plan data to show updated distribution
      setTimeout(() => {
        mealPlanState.refetch();
      }, 1000);
    }
  };

  if (mealPlanState.error) {
    return <ErrorState error={mealPlanState.error} onRetry={mealPlanState.refetch} />;
  }

  if (mealPlanState.isLoading && !mealPlanState.currentWeekPlan) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="space-y-6">
        <MealPlanHeader 
          onGenerateAI={() => mealPlanState.openAIDialog()}
          onShuffle={handleShuffle}
          onShowShoppingList={() => mealPlanState.openShoppingListDialog()}
          onRegeneratePlan={() => mealPlanState.openAIDialog()}
          isGenerating={mealPlanState.isGenerating}
          isShuffling={isShuffling}
          hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
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

      {/* Enhanced Shopping List Drawer */}
      <ShoppingListDrawer
        isOpen={mealPlanState.showShoppingListDialog}
        onClose={() => mealPlanState.closeShoppingListDialog()}
        weeklyPlan={mealPlanState.currentWeekPlan}
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={() => {
          console.log('🛒 Shopping list updated');
        }}
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
        showShoppingListDialog={false} // Now handled by ShoppingListDrawer
        setShowShoppingListDialog={() => {}} // Disabled - using drawer instead
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
