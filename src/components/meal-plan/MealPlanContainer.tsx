
import { useState } from "react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import MealPlanHeader from "./MealPlanHeader";
import UnifiedNavigation from "./UnifiedNavigation";
import DayOverview from "./DayOverview";
import WeeklyViewContainer from "./WeeklyViewContainer";
import EmptyWeekState from "./EmptyWeekState";
import LoadingState from "./LoadingState";
import EnhancedAddSnackDialog from "./EnhancedAddSnackDialog";

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
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);

  console.log('🎯 MealPlanContainer - Current view mode:', viewMode);

  const handleAddSnack = () => {
    console.log('🍎 Opening add snack dialog for day:', selectedDayNumber);
    setShowAddSnackDialog(true);
  };

  const handleSnackAdded = () => {
    console.log('✅ Snack added successfully, refreshing data');
    refetch();
    setShowAddSnackDialog(false);
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="mb-4">Error: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
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
    <div className="space-y-4">
      {/* Header with Actions */}
      <MealPlanHeader
        onGenerateAI={() => {}}
        onShuffle={handleRegeneratePlan}
        onShowShoppingList={() => {}}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* Unified Navigation */}
      <UnifiedNavigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        onWeekChange={setCurrentWeekOffset}
        selectedDayNumber={selectedDayNumber}
        onDayChange={setSelectedDayNumber}
        showDaySelector={viewMode === 'daily'}
      />

      {/* Content based on view mode */}
      {viewMode === 'daily' ? (
        <DayOverview
          selectedDayNumber={selectedDayNumber}
          dailyMeals={dailyMeals}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          onViewMeal={handleShowRecipe}
          onExchangeMeal={(meal, index) => handleExchangeMeal(meal, index)}
          onAddSnack={handleAddSnack}
          weekStartDate={weekStartDate}
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
            setShowAddSnackDialog(true);
          }}
        />
      )}

      {/* Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => setShowAddSnackDialog(false)}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={handleSnackAdded}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
      />
    </div>
  );
};

export default MealPlanContainer;
