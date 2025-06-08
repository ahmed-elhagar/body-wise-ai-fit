
import React, { useState, useRef } from 'react';
import { useMealPlanState } from '../hooks/useMealPlanState';
import MealPlanHeader from './MealPlanHeader';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MealPlanViewToggle } from './MealPlanViewToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatWeekRange, getDayName } from '@/utils/mealPlanUtils';

// Feature-based imports - using the correct paths
import { MealExchangeDialog } from './dialogs/MealExchangeDialog';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { EnhancedRecipeDialog } from './EnhancedRecipeDialog';
import { EnhancedAddSnackDialog } from './dialogs/EnhancedAddSnackDialog';
import { ModernShoppingListDrawer } from './dialogs/ModernShoppingListDrawer';
import { MealPlanAILoadingDialog } from './dialogs/MealPlanAILoadingDialog';

const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
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
        />
        
        {/* Navigation Card - Always visible */}
        <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(mealPlanState.currentWeekOffset - 1)}
                className="h-10 w-10 p-0 border-gray-300"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  {formatWeekRange(mealPlanState.weekStartDate)}
                </h3>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(mealPlanState.currentWeekOffset + 1)}
                className="h-10 w-10 p-0 border-gray-300"
                aria-label="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <MealPlanViewToggle 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          
          {/* Days Navigation - Always visible */}
          <div className="grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
              const isSelected = mealPlanState.selectedDayNumber === dayNumber;
              const dayName = getDayName(dayNumber);
              
              return (
                <Button
                  key={dayNumber}
                  variant="ghost"
                  className={`h-14 p-2 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg scale-105 border-0' 
                      : 'bg-gray-50/80 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 border border-gray-200/50'
                  }`}
                  onClick={() => mealPlanState.setSelectedDayNumber(dayNumber)}
                >
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className={`text-xs font-medium ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                      {dayName.slice(0, 3)}
                    </span>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {dayName}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>
        
        {/* Content Area with Loading Overlay - Only over meal content */}
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
          {mealPlanState.isLoading && displayData && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[400px]">
              <div className="flex flex-col items-center gap-3 bg-white rounded-lg shadow-lg p-6 border">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-sm text-gray-700 font-medium">Loading meals...</p>
                <p className="text-xs text-gray-500">Please wait while we fetch your meal plan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Loading Dialog - Step-by-step loading experience - Now using top-right position */}
      <MealPlanAILoadingDialog 
        isGenerating={mealPlanState.isGenerating}
        onClose={() => mealPlanState.refetch()}
        position="top-right"
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

export default MealPlanContainer;
