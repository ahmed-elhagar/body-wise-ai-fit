
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import EnhancedDaySelector from "./EnhancedDaySelector";
import EnhancedMealPlanHeader from "./EnhancedMealPlanHeader";
import DayOverview from "./DayOverview";
import WeeklyView from "./WeeklyView";
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

  console.log('🎯 MealPlanContent - View mode:', viewMode, 'Selected day:', selectedDayNumber, 'Daily meals:', dailyMeals?.length);

  const handleShuffle = () => {
    handleRegeneratePlan();
  };

  const handleWeekChange = (offset: number) => {
    try {
      console.log('🗓️ MealPlanContent - Week change requested:', offset);
      setCurrentWeekOffset(offset);
    } catch (error) {
      console.error('❌ MealPlanContent - Week change error:', error);
    }
  };

  const handleAddSnackForDay = (dayNumber: number) => {
    setSelectedDayNumber(dayNumber);
    onShowAddSnackDialog();
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
      {/* Enhanced Header Section */}
      <EnhancedMealPlanHeader
        onGenerateAI={onShowAIDialog}
        onShuffle={handleShuffle}
        onShowShoppingList={onShowShoppingListDialog}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* Enhanced Day Selector with View Mode Toggle */}
      {currentWeekPlan?.weeklyPlan && (
        <EnhancedDaySelector
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDayChange={setSelectedDayNumber}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          currentWeekOffset={currentWeekOffset}
          onWeekChange={handleWeekChange}
          dailyMealsCount={dailyMeals?.length || 0}
        />
      )}

      {/* Day Overview Section (only in daily view) */}
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
            <WeeklyView
              weekStartDate={weekStartDate}
              currentWeekPlan={currentWeekPlan}
              onSelectDay={setSelectedDayNumber}
              onSwitchToDaily={() => setViewMode('daily')}
              onShowRecipe={handleShowRecipe}
              onExchangeMeal={handleExchangeMeal}
              onAddSnack={handleAddSnackForDay}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MealPlanContent;
