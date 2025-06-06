
import React, { useState, useRef } from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import MealPlanHeader from '@/components/meal-plan/MealPlanHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from '@/components/meal-plan/components/ErrorState';
import LoadingState from '@/components/meal-plan/components/LoadingState';
import MealPlanAILoadingDialog from '@/components/meal-plan/MealPlanAILoadingDialog';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import ModernShoppingListDrawer from '@/components/shopping-list/ModernShoppingListDrawer';
import { Loader2 } from 'lucide-react';

// Import the correct meal exchange dialog
import { MealExchangeDialog } from '@/components/meal-plan/MealExchangeDialog';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import EnhancedAddSnackDialog from '@/components/meal-plan/EnhancedAddSnackDialog';
import { EnhancedRecipeDialog } from '@/components/meal-plan/EnhancedRecipeDialog';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  
  // Keep track of the last successfully loaded data to show during transitions
  const lastLoadedDataRef = useRef(mealPlanState.currentWeekPlan);
  const [isWeekTransition, setIsWeekTransition] = useState(false);

  // Update the ref when we have new data and not loading
  if (mealPlanState.currentWeekPlan && !mealPlanState.isLoading) {
    lastLoadedDataRef.current = mealPlanState.currentWeekPlan;
    if (isWeekTransition) {
      setIsWeekTransition(false);
    }
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

  // Enhanced week change handler that manages loading states
  const handleWeekChange = async (offset: number) => {
    console.log('📅 Week change initiated, setting transition state');
    setIsWeekTransition(true);
    await mealPlanState.setCurrentWeekOffset(offset);
  };

  // Determine what data to display
  const displayData = mealPlanState.currentWeekPlan || lastLoadedDataRef.current;
  const showLoadingOverlay = mealPlanState.isLoading && displayData;

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
        <MealPlanHeader 
          onGenerateAI={() => mealPlanState.openAIDialog()}
          onShuffle={handleShuffle}
          onShowShoppingList={() => mealPlanState.openShoppingListDialog()}
          onRegeneratePlan={() => mealPlanState.openAIDialog()}
          isGenerating={mealPlanState.isGenerating}
          isShuffling={isShuffling}
          hasWeeklyPlan={!!displayData?.weeklyPlan}
        />
        
        <MealPlanNavigation 
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={handleWeekChange}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          onDayChange={mealPlanState.setSelectedDayNumber}
          weekStartDate={mealPlanState.weekStartDate}
        />
        
        {/* Content Area with Smart Loading Overlay */}
        <div className="relative">
          {/* Loading Overlay - Shows during week transitions */}
          {showLoadingOverlay && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg min-h-[500px]">
              <div className="flex flex-col items-center gap-3 bg-white rounded-lg shadow-lg p-6">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-sm text-gray-700 font-medium">Loading week data...</p>
              </div>
            </div>
          )}
          
          {/* Main Content - Always rendered with last known data */}
          <div className={`transition-opacity duration-200 ${showLoadingOverlay ? 'opacity-30' : 'opacity-100'}`}>
            <MealPlanContent
              viewMode="daily"
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
          </div>
        </div>
      </div>

      {/* AI Loading Dialog - Step-by-step loading experience - Now using top-right position */}
      <MealPlanAILoadingDialog 
        isGenerating={mealPlanState.isGenerating}
        onClose={() => mealPlanState.refetch()}
        position="top-right" // Now using top-right for less intrusive loading
      />

      {/* Modern Shopping List Drawer - Complete revamped experience */}
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

      {/* Enhanced Meal Exchange Dialog - Our latest implementation */}
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
