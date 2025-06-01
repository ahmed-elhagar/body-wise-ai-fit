
import { useMealPlanState } from '@/hooks/meal-plan/useMealPlanState';
import MealPlanLayout from './layout/MealPlanLayout';
import MealPlanHeader from './components/MealPlanHeader';
import MealPlanNavigation from './components/MealPlanNavigation';
import MealPlanContent from './components/MealPlanContent';
import MealPlanDialogs from './dialogs/MealPlanDialogs';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const MealPlanPage = () => {
  const mealPlanState = useMealPlanState();

  if (mealPlanState.error) {
    return (
      <MealPlanLayout>
        <ErrorState 
          error={mealPlanState.error} 
          onRetry={mealPlanState.refetch}
        />
      </MealPlanLayout>
    );
  }

  return (
    <MealPlanLayout>
      {/* Header with AI Credits */}
      <MealPlanHeader
        remainingCredits={mealPlanState.remainingCredits}
        onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
        isGenerating={mealPlanState.isGenerating}
      />

      {/* Navigation */}
      {mealPlanState.mealPlanData && (
        <MealPlanNavigation
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          onDayChange={mealPlanState.setSelectedDayNumber}
        />
      )}

      {/* Main Content */}
      {mealPlanState.isLoading ? (
        <LoadingState />
      ) : (
        <MealPlanContent
          mealPlanData={mealPlanState.mealPlanData}
          dailyMeals={mealPlanState.dailyMeals}
          totalCalories={mealPlanState.totalCalories}
          totalProtein={mealPlanState.totalProtein}
          targetDayCalories={mealPlanState.targetDayCalories}
          selectedDayNumber={mealPlanState.selectedDayNumber}
          weekStartDate={mealPlanState.weekStartDate}
          onShowRecipe={mealPlanState.openRecipeDialog}
          onExchangeMeal={mealPlanState.openExchangeDialog}
          onShowAddSnack={() => mealPlanState.setShowAddSnackDialog(true)}
          onShowShoppingList={() => mealPlanState.setShowShoppingListDialog(true)}
          onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
        />
      )}

      {/* All Dialogs */}
      <MealPlanDialogs
        {...mealPlanState}
        onRefetch={mealPlanState.refetch}
      />
    </MealPlanLayout>
  );
};

export default MealPlanPage;
