
import { useState } from "react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import MealPlanHeader from "./MealPlanHeader";
import ViewModeSelector from "./ViewModeSelector";
import DailyViewContainer from "./DailyViewContainer";
import WeeklyViewContainer from "./WeeklyViewContainer";
import EmptyWeekState from "./EmptyWeekState";
import LoadingState from "./LoadingState";

const MealPlanContainer = () => {
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

  console.log('🎯 MealPlanContainer - Current view mode:', viewMode);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error.message}
        <button onClick={() => refetch()} className="ml-4 px-4 py-2 bg-red-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!currentWeekPlan?.weeklyPlan) {
    return <EmptyWeekState onGenerateClick={() => {}} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <MealPlanHeader
        onGenerateAI={() => {}}
        onShuffle={handleRegeneratePlan}
        onShowShoppingList={() => {}}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* View Mode Selector */}
      <ViewModeSelector
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        onWeekChange={setCurrentWeekOffset}
      />

      {/* Content based on view mode */}
      {viewMode === 'daily' ? (
        <DailyViewContainer
          selectedDayNumber={selectedDayNumber}
          onDayChange={setSelectedDayNumber}
          weekStartDate={weekStartDate}
          dailyMeals={dailyMeals}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          onViewMeal={handleShowRecipe}
          onExchangeMeal={handleExchangeMeal}
          onAddSnack={() => {}}
        />
      ) : (
        <WeeklyViewContainer
          weekStartDate={weekStartDate}
          currentWeekPlan={currentWeekPlan}
          onSelectDay={setSelectedDayNumber}
          onSwitchToDaily={() => setViewMode('daily')}
          onShowRecipe={handleShowRecipe}
          onExchangeMeal={handleExchangeMeal}
          onAddSnack={(dayNumber: number) => {
            setSelectedDayNumber(dayNumber);
          }}
        />
      )}
    </div>
  );
};

export default MealPlanContainer;
