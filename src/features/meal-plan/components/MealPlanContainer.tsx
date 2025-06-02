
import React, { useState } from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { useEnhancedShoppingListEmail } from '@/hooks/useEnhancedShoppingListEmail';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { useLifePhaseNutrition } from '@/hooks/useLifePhaseNutrition';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { MealPlanPageHeader } from './MealPlanPageHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './dialogs/MealPlanDialogs';
import { LifePhaseRibbon } from '@/components/meal-plan/LifePhaseRibbon';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';

export const MealPlanContainer = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const { nutritionContext } = useLifePhaseNutrition();
  
  const mealPlanState = useMealPlanState();
  
  // Enhanced shopping list functionality
  const { 
    sendShoppingListEmail, 
    isLoading: isEmailLoading 
  } = useEnhancedShoppingListEmail();

  if (mealPlanState.isLoading) {
    return (
      <EnhancedErrorBoundary>
        <div className="min-h-screen flex items-center justify-center">
          <EnhancedLoadingIndicator
            status="loading"
            type="general"
            message="Loading meal plan..."
            variant="card"
            size="lg"
          />
        </div>
      </EnhancedErrorBoundary>
    );
  }

  if (mealPlanState.error) {
    return (
      <EnhancedErrorBoundary>
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
      </EnhancedErrorBoundary>
    );
  }

  const handleShuffleMeals = async () => {
    if (mealPlanState.currentWeekPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(mealPlanState.currentWeekPlan.weeklyPlan.id);
      if (success) {
        await mealPlanState.refetch();
      }
    }
  };

  const handleSendShoppingListEmail = async (): Promise<boolean> => {
    return await sendShoppingListEmail(mealPlanState.currentWeekPlan);
  };

  return (
    <EnhancedErrorBoundary>
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Life Phase Nutrition Banner */}
        {(nutritionContext.isPregnant || nutritionContext.isBreastfeeding || nutritionContext.isMuslimFasting) && (
          <LifePhaseRibbon
            pregnancyTrimester={nutritionContext.pregnancyTrimester}
            breastfeedingLevel={nutritionContext.breastfeedingLevel}
            fastingType={nutritionContext.fastingType}
            extraCalories={nutritionContext.extraCalories}
          />
        )}

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
          totalCalories={mealPlanState.totalCalories || 0}
          targetDayCalories={mealPlanState.targetDayCalories || 2000}
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
          enhancedShoppingItems={[]}
          onSendShoppingListEmail={handleSendShoppingListEmail}
          userCredits={mealPlanState.userCredits}
          hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
          isEmailLoading={isEmailLoading}
          currentWeekPlan={mealPlanState.currentWeekPlan}
        />
      </div>
    </EnhancedErrorBoundary>
  );
};
