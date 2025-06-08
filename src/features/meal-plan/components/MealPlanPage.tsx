
import React from 'react';
import { useMealPlanState } from '../hooks/useMealPlanState';
import MealPlanPageTitle from './MealPlanPageTitle';
import MealPlanEmptyState from './MealPlanEmptyState';
import MealPlanWeekView from './MealPlanWeekView';
import MealPlanDayView from './MealPlanDayView';
import UnifiedNavigation from './UnifiedNavigation';
import MealPlanRecipeDialog from './MealPlanRecipeDialog';
import MealPlanAIDialog from './MealPlanAIDialog';
import ShoppingListDialog from './ShoppingListDialog';
import { EnhancedPageLoading } from '@/components/EnhancedPageLoading';

export const MealPlanPage: React.FC = () => {
  const {
    currentWeekPlan,
    dailyMeals,
    isLoading,
    viewMode,
    setViewMode,
    weekStartDate,
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    handleShowRecipe,
    handleExchangeMeal,
    handleAddSnack,
    handleGenerateAI,
    handleShuffle,
    isGenerating,
    selectedMeal,
    showRecipeDialog,
    showAIDialog,
    showShoppingListDialog,
    closeRecipeDialog,
    closeAIDialog,
    closeShoppingListDialog,
    handleShowShoppingList,
    switchToDaily,
    aiPreferences,
    updateAIPreferences,
  } = useMealPlanState();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4 py-6">
          <EnhancedPageLoading 
            title="Loading your meal plan..."
            description="Please wait while we fetch your personalized meal plan"
            estimatedTime={3}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Title */}
        <MealPlanPageTitle />

        {/* Navigation */}
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

        {/* Main Content */}
        {!currentWeekPlan?.weeklyPlan ? (
          <MealPlanEmptyState onGenerateClick={handleGenerateAI} />
        ) : viewMode === 'weekly' ? (
          <MealPlanWeekView
            weekStartDate={weekStartDate}
            currentWeekPlan={currentWeekPlan}
            onSelectDay={setSelectedDayNumber}
            onSwitchToDaily={switchToDaily}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
            onAddSnack={handleAddSnack}
          />
        ) : (
          <MealPlanDayView
            dayNumber={selectedDayNumber}
            weeklyPlan={currentWeekPlan}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
            onAddSnack={handleAddSnack}
          />
        )}

        {/* Dialogs */}
        {showRecipeDialog && selectedMeal && (
          <MealPlanRecipeDialog
            meal={selectedMeal}
            isOpen={showRecipeDialog}
            onClose={closeRecipeDialog}
          />
        )}

        {showAIDialog && (
          <MealPlanAIDialog
            open={showAIDialog}
            onOpenChange={closeAIDialog}
            preferences={aiPreferences}
            onPreferencesChange={updateAIPreferences}
            onGenerate={handleShuffle}
            isGenerating={isGenerating}
          />
        )}

        {showShoppingListDialog && currentWeekPlan && (
          <ShoppingListDialog
            isOpen={showShoppingListDialog}
            onClose={closeShoppingListDialog}
            shoppingItems={{
              items: [],
              groupedItems: {}
            }}
            onSendEmail={async () => false}
            weekStartDate={weekStartDate}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default MealPlanPage;
