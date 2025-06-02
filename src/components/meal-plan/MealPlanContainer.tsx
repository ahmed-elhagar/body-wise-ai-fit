import { useState } from "react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { useEnhancedMealShuffle } from "@/hooks/useEnhancedMealShuffle";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";
import MealPlanHeader from "./MealPlanHeader";
import UnifiedNavigation from "./UnifiedNavigation";
import DayOverview from "./DayOverview";
import WeeklyViewContainer from "./WeeklyViewContainer";
import EmptyWeekState from "./EmptyWeekState";
import LoadingState from "./LoadingState";
import EnhancedAddSnackDialog from "./EnhancedAddSnackDialog";
import EnhancedRecipeDialog from "./EnhancedRecipeDialog";
import MealExchangeDialog from "../MealExchangeDialog";
import ShoppingListDialog from "./ShoppingListDialog";

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

  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(currentWeekPlan);

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isWeekChanging, setIsWeekChanging] = useState(false);

  console.log('🎯 MealPlanContainer - Current view mode:', viewMode);
  console.log('🎯 MealPlanContainer - Selected meal for dialog:', selectedMeal?.name);

  const handleAddSnack = () => {
    console.log('🍎 Opening add snack dialog for day:', selectedDayNumber);
    setShowAddSnackDialog(true);
  };

  const handleSnackAdded = () => {
    console.log('✅ Snack added successfully, refreshing data');
    refetch();
    setShowAddSnackDialog(false);
  };

  const handleViewMeal = (meal) => {
    console.log('👁️ Opening recipe dialog for meal:', meal.name);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMealClick = (meal) => {
    console.log('🔄 Opening exchange dialog for meal:', meal.name);
    setSelectedMeal(meal);
    setShowExchangeDialog(true);
  };

  const handleRecipeGenerated = () => {
    console.log('✅ Recipe generated, refreshing data');
    refetch();
    setShowRecipeDialog(false);
    setSelectedMeal(null);
  };

  const handleMealExchanged = () => {
    console.log('✅ Meal exchanged, refreshing data');
    refetch();
    setShowExchangeDialog(false);
    setSelectedMeal(null);
  };

  const handleShowShoppingList = () => {
    console.log('🛒 Opening shopping list dialog');
    setShowShoppingDialog(true);
  };

  const handleGenerateAI = async () => {
    console.log('✨ Generate AI meal plan triggered');
    try {
      await handleRegeneratePlan();
    } catch (error) {
      console.error('❌ AI generation failed:', error);
    }
  };

  const handleShuffle = async () => {
    console.log('🔄 Enhanced shuffle meals triggered');
    if (!currentWeekPlan?.weeklyPlan?.id) {
      console.error('❌ No weekly plan ID available for shuffle');
      return;
    }
    
    try {
      const success = await shuffleMeals(currentWeekPlan.weeklyPlan.id);
      if (success) {
        // Refresh the data after successful shuffle
        setTimeout(() => {
          refetch();
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Enhanced shuffle failed:', error);
    }
  };

  const handleWeekChange = async (newOffset: number) => {
    console.log('📅 Week change triggered:', newOffset);
    setIsWeekChanging(true);
    
    try {
      setCurrentWeekOffset(newOffset);
      // Give some time for the new data to load
      setTimeout(() => {
        setIsWeekChanging(false);
      }, 500);
    } catch (error) {
      console.error('❌ Week change failed:', error);
      setIsWeekChanging(false);
    }
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

  if (isLoading || isWeekChanging) {
    return <LoadingState />;
  }

  if (!currentWeekPlan?.weeklyPlan) {
    return <EmptyWeekState onGenerateClick={handleGenerateAI} />;
  }

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <MealPlanHeader
        onGenerateAI={handleGenerateAI}
        onShuffle={handleShuffle}
        onShowShoppingList={handleShowShoppingList}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        isShuffling={isShuffling}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
      />

      {/* Unified Navigation */}
      <UnifiedNavigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        onWeekChange={handleWeekChange}
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
          onViewMeal={handleViewMeal}
          onExchangeMeal={handleExchangeMealClick}
          onAddSnack={handleAddSnack}
          weekStartDate={weekStartDate}
        />
      ) : (
        <WeeklyViewContainer
          weekStartDate={weekStartDate}
          currentWeekPlan={currentWeekPlan}
          onSelectDay={setSelectedDayNumber}
          onSwitchToDaily={() => setViewMode('daily')}
          onShowRecipe={handleViewMeal}
          onExchangeMeal={handleExchangeMealClick}
          onAddSnack={(dayNumber: number) => {
            setSelectedDayNumber(dayNumber);
            setShowAddSnackDialog(true);
          }}
        />
      )}

      {/* Dialog Components */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => setShowAddSnackDialog(false)}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={handleSnackAdded}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
      />

      <EnhancedRecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => {
          setShowRecipeDialog(false);
          setSelectedMeal(null);
        }}
        meal={selectedMeal}
        onRecipeGenerated={handleRecipeGenerated}
      />

      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={() => {
          setShowExchangeDialog(false);
          setSelectedMeal(null);
        }}
        currentMeal={selectedMeal}
        onExchange={handleMealExchanged}
      />

      <ShoppingListDialog
        isOpen={showShoppingDialog}
        onClose={() => setShowShoppingDialog(false)}
        shoppingItems={enhancedShoppingItems}
        weekStartDate={weekStartDate}
        onSendEmail={sendShoppingListEmail}
      />
    </div>
  );
};

export default MealPlanContainer;
