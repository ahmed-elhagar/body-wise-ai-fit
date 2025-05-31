
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import CompactNavigationBar from "./CompactNavigationBar";
import EnhancedMealPlanHeader from "./EnhancedMealPlanHeader";
import DayOverview from "./DayOverview";
import WeeklyMealGrid from "./WeeklyMealGrid";
import EmptyWeekState from "./EmptyWeekState";
import DayOverviewSection from "./DayOverviewSection";

interface MealPlanContentProps {
  onShowAIDialog: () => void;
  onShowAddSnackDialog: () => void;
  onShowShoppingListDialog: () => void;
}

const MealPlanContent = ({
  onShowAIDialog,
  onShowAddSnackDialog,
  onShowShoppingListDialog
}: MealPlanContentProps) => {
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
    
    // Actions
    handleRegeneratePlan,
    refetch,
    isGenerating,
    
    // Handlers
    handleShowRecipe,
    handleExchangeMeal
  } = useMealPlanPage();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  console.log('🎯 MealPlanContent - Selected day meals:', selectedDayNumber, dailyMeals?.length);

  const handleShuffle = () => {
    handleRegeneratePlan();
  };

  // Enhanced week change handler with error catching
  const handleWeekChange = (offset: number) => {
    try {
      console.log('🗓️ MealPlanContent - Week change requested:', offset);
      setCurrentWeekOffset(offset);
    } catch (error) {
      console.error('❌ MealPlanContent - Week change error:', error);
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Error loading meal plan: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-fitness-primary text-white rounded"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <>
      {/* Clean Header Section */}
      <EnhancedMealPlanHeader
        onGenerateAI={onShowAIDialog}
        onShuffle={handleShuffle}
        onShowShoppingList={onShowShoppingListDialog}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* Compact Navigation Section */}
      {currentWeekPlan?.weeklyPlan && (
        <CompactNavigationBar
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDayChange={setSelectedDayNumber}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          currentWeekOffset={currentWeekOffset}
          onWeekChange={handleWeekChange}
        />
      )}

      {/* Day Overview Section with Add Snack */}
      {currentWeekPlan?.weeklyPlan && viewMode === 'daily' && (
        <DayOverviewSection
          selectedDayNumber={selectedDayNumber}
          weekStartDate={weekStartDate}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          mealsCount={dailyMeals?.length || 0}
          onAddSnack={onShowAddSnackDialog}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-fitness-primary-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <div className="w-8 h-8 bg-fitness-primary-300 rounded-full"></div>
          </div>
          <p className="text-fitness-primary-600">Loading your meal plan...</p>
        </Card>
      ) : !currentWeekPlan?.weeklyPlan ? (
        <EmptyWeekState onGenerateClick={onShowAIDialog} />
      ) : (
        <div className="space-y-6">
          {viewMode === 'daily' ? (
            <DayOverview
              selectedDayNumber={selectedDayNumber}
              dailyMeals={dailyMeals}
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              targetDayCalories={targetDayCalories}
              onViewMeal={handleShowRecipe}
              onExchangeMeal={handleExchangeMeal}
              onAddSnack={onShowAddSnackDialog}
              weekStartDate={weekStartDate}
            />
          ) : (
            <WeeklyMealGrid
              currentWeekPlan={currentWeekPlan}
              onViewMeal={handleShowRecipe}
              onExchangeMeal={handleExchangeMeal}
              weekStartDate={weekStartDate}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MealPlanContent;
