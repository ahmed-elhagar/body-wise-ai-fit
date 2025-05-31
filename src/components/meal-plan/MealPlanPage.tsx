
import { useState } from "react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { Card } from "@/components/ui/card";
import DayOverview from "./DayOverview";
import WeeklyMealGrid from "./WeeklyMealGrid";
import EnhancedNavigationBar from "./EnhancedNavigationBar";
import EnhancedActionBar from "./EnhancedActionBar";
import EnhancedRecipeDialog from "./EnhancedRecipeDialog";
import EmptyWeekState from "./EmptyWeekState";
import MealPlanDialogs from "../MealPlanDialogs";
import { ErrorBoundary } from "../ErrorBoundary";

const MealPlanPage = () => {
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
    
    // Dialogs
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    selectedMealIndex,
    aiPreferences,
    setAiPreferences,
    
    // Calculations
    dailyMeals,
    todaysMeals,
    shoppingItems,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Actions
    handleRegeneratePlan,
    handleGenerateAIPlan,
    handleRecipeGenerated,
    refetch,
    isGenerating,
    
    // Handlers
    handleShowRecipe,
    handleExchangeMeal
  } = useMealPlanPage();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  console.log('🎯 MealPlanPage - Selected day meals:', selectedDayNumber, dailyMeals?.length);

  const handleAddSnack = () => {
    setShowAddSnackDialog(true);
  };

  const handleShowShoppingList = () => {
    setShowShoppingListDialog(true);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-red-600">Error loading meal plan: {error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-fitness-primary text-white rounded"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-25 via-white to-fitness-accent-25">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Enhanced Navigation Bar */}
          <EnhancedNavigationBar
            weekStartDate={weekStartDate}
            selectedDayNumber={selectedDayNumber}
            onDayChange={setSelectedDayNumber}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            currentWeekOffset={currentWeekOffset}
            onWeekChange={setCurrentWeekOffset}
          />

          {/* Enhanced Action Bar */}
          {currentWeekPlan?.weeklyPlan && (
            <EnhancedActionBar
              onAddSnack={handleAddSnack}
              onShowShoppingList={handleShowShoppingList}
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              targetDayCalories={targetDayCalories}
              mealsCount={dailyMeals?.length || 0}
              selectedDayNumber={selectedDayNumber}
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
            <EmptyWeekState onGenerateClick={() => setShowAIDialog(true)} />
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
                  onAddSnack={handleAddSnack}
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

          {/* Enhanced Recipe Dialog */}
          <EnhancedRecipeDialog
            isOpen={showRecipeDialog}
            onClose={() => setShowRecipeDialog(false)}
            meal={selectedMeal}
            onRecipeGenerated={handleRecipeGenerated}
          />

          {/* All Other Dialogs */}
          <MealPlanDialogs
            showAIDialog={showAIDialog}
            onCloseAIDialog={() => setShowAIDialog(false)}
            aiPreferences={aiPreferences}
            onPreferencesChange={setAiPreferences}
            onGenerateAI={handleGenerateAIPlan}
            isGenerating={isGenerating}
            
            showAddSnackDialog={showAddSnackDialog}
            onCloseAddSnackDialog={() => setShowAddSnackDialog(false)}
            selectedDay={selectedDayNumber}
            weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
            onSnackAdded={refetch}
            currentDayCalories={totalCalories}
            targetDayCalories={targetDayCalories}
            
            showShoppingListDialog={showShoppingListDialog}
            onCloseShoppingListDialog={() => setShowShoppingListDialog(false)}
            shoppingItems={shoppingItems}
            
            showRecipeDialog={false} // Using EnhancedRecipeDialog instead
            onCloseRecipeDialog={() => {}}
            selectedMeal={null}
            
            showExchangeDialog={showExchangeDialog}
            onCloseExchangeDialog={() => setShowExchangeDialog(false)}
            selectedMealIndex={selectedMealIndex}
            onExchange={() => refetch()}
            
            onRecipeGenerated={handleRecipeGenerated}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MealPlanPage;
