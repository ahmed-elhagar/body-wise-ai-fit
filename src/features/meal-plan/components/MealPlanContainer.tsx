
import React, { useState, useRef } from 'react';
import { useMealPlanState } from '../hooks/useMealPlanState';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import MealPlanHeader from './MealPlanHeader';
import MealPlanNavigation from './MealPlanNavigation';
import MealPlanLoadingOverlay from './MealPlanLoadingOverlay';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

// Feature-based imports - using the correct paths
import { MealExchangeDialog } from './dialogs/MealExchangeDialog';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { EnhancedRecipeDialog } from './EnhancedRecipeDialog';
import EnhancedAddSnackDialog from './dialogs/EnhancedAddSnackDialog';
import { ModernShoppingListDrawer } from './dialogs/ModernShoppingListDrawer';
import { MealPlanAILoadingDialog } from './dialogs/MealPlanAILoadingDialog';

const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const { remaining: remainingCredits } = useCentralizedCredits();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  // Keep track of the last successfully loaded data to show during transitions
  const lastLoadedDataRef = useRef(mealPlanState.currentWeekPlan);

  // Update the ref when we have new data and not loading
  if (mealPlanState.currentWeekPlan && !mealPlanState.isLoading) {
    lastLoadedDataRef.current = mealPlanState.currentWeekPlan;
  }

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

  // Enhanced week change handler that manages loading states properly
  const handleWeekChange = async (offset: number) => {
    console.log('📅 Week change initiated');
    await mealPlanState.setCurrentWeekOffset(offset);
  };

  // Determine what data to display
  const displayData = mealPlanState.currentWeekPlan || lastLoadedDataRef.current;

  // Only show full error state if there's an error and no existing data
  if (mealPlanState.error && !displayData) {
    return <ErrorState error={mealPlanState.error} onRetry={mealPlanState.refetch} />;
  }

  // Only show full loading state on initial load (no existing data)
  if (mealPlanState.isLoading && !displayData) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header - Always visible */}
        <MealPlanHeader 
          onGenerateAI={() => mealPlanState.openAIDialog()}
          onShuffle={handleShuffle}
          onShowShoppingList={() => mealPlanState.openShoppingListDialog()}
          onRegeneratePlan={() => mealPlanState.openAIDialog()}
          isGenerating={mealPlanState.isGenerating}
          isShuffling={isShuffling}
          hasWeeklyPlan={!!displayData?.weeklyPlan}
          remainingCredits={remainingCredits}
        />
        
        {/* Navigation Card - Always visible */}
        <MealPlanNavigation
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={handleWeekChange}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          onDayChange={mealPlanState.setSelectedDayNumber}
        />
        
        {/* Content Area with Loading Overlay */}
        <div className="relative">
          {/* Main Content - Always rendered with last known data */}
          <MealPlanContent
            viewMode={viewMode}
            currentWeekPlan={displayData}
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
            setCurrentWeekOffset={handleWeekChange}
            setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
          />
          
          {/* Loading Overlay - Only shows when loading and we have existing data */}
          <MealPlanLoadingOverlay 
            isVisible={mealPlanState.isLoading && !!displayData}
          />
        </div>
      </div>

      {/* AI Loading Dialog - Step-by-step loading experience */}
      <MealPlanAILoadingDialog 
        isGenerating={mealPlanState.isGenerating}
        onClose={() => mealPlanState.refetch()}
        position="top-right"
      />

      {/* Modern Shopping List Drawer */}
      <ModernShoppingListDrawer
        isOpen={mealPlanState.showShoppingListDialog}
        onClose={() => mealPlanState.closeShoppingListDialog()}
        weeklyPlan={mealPlanState.currentWeekPlan}
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={() => {
          console.log('🛒 Shopping list updated');
          mealPlanState.refetch();
        }}
      />

      {/* AI Generation Dialog */}
      <AIGenerationDialog
        open={mealPlanState.showAIDialog}
        onClose={() => mealPlanState.closeAIDialog()}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.updateAIPreferences}
        onGenerate={mealPlanState.handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
        hasExistingPlan={!!displayData?.weeklyPlan}
      />

      {/* Enhanced Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={mealPlanState.showAddSnackDialog}
        onClose={() => mealPlanState.closeAddSnackDialog()}
        selectedDay={mealPlanState.selectedDayNumber}
        currentDayCalories={mealPlanState.totalCalories}
        targetDayCalories={mealPlanState.targetDayCalories}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={() => mealPlanState.refetch()}
      />

      {/* Enhanced Meal Exchange Dialog */}
      <MealExchangeDialog
        isOpen={mealPlanState.showExchangeDialog}
        onClose={() => mealPlanState.closeExchangeDialog()}
        meal={mealPlanState.selectedMeal}
        onExchangeComplete={() => {
          mealPlanState.refetch();
          mealPlanState.closeExchangeDialog();
        }}
      />

      {/* Enhanced Recipe Dialog */}
      <EnhancedRecipeDialog
        isOpen={mealPlanState.showRecipeDialog}
        onClose={() => mealPlanState.closeRecipeDialog()}
        meal={mealPlanState.selectedMeal}
        onRecipeUpdated={() => mealPlanState.refetch()}
      />
    </>
  );
};

export default MealPlanContainer;
