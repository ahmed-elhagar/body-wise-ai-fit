
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import MealPlanPageContent from "@/components/meal-plan/MealPlanPageContent";

const MealPlan = () => {
  const mealPlanState = useMealPlanPage();

  // Convert meals to shopping items
  const convertMealsToShoppingItems = (meals: any[]) => {
    const items: any[] = [];
    meals.forEach(meal => {
      if (meal.ingredients) {
        meal.ingredients.forEach((ingredient: any) => {
          const name = typeof ingredient === 'string' ? ingredient : ingredient.name || '';
          const amount = typeof ingredient === 'string' ? '1 unit' : ingredient.amount || '1 unit';
          items.push({ name, amount });
        });
      }
    });
    return items;
  };

  // Enhanced meal handlers
  const handleShowRecipe = (meal: any) => {
    const convertedMeal = {
      ...meal,
      type: meal.meal_type || 'meal',
      time: '12:00',
      cookTime: meal.cook_time || 30,
      prepTime: meal.prep_time || 15,
      servings: meal.servings || 1,
      difficulty: 'medium'
    };
    mealPlanState.handleShowRecipe(convertedMeal);
  };

  const handleExchangeMeal = (meal: any, index: number) => {
    const convertedMeal = {
      ...meal,
      type: meal.meal_type || 'meal',
      time: '12:00',
      cookTime: meal.cook_time || 30,
      prepTime: meal.prep_time || 15,
      servings: meal.servings || 1,
      difficulty: 'medium'
    };
    mealPlanState.handleExchangeMeal(convertedMeal, index);
  };

  return (
    <ProtectedRoute>
      <MealPlanPageContent
        currentDate={mealPlanState.currentDate}
        currentDay={mealPlanState.currentDay}
        onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
        onRegeneratePlan={mealPlanState.handleRegeneratePlan}
        isGenerating={mealPlanState.isGenerating}
        isShuffling={mealPlanState.isShuffling}
        dietType={mealPlanState.currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType}
        totalWeeklyCalories={mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        setCurrentWeekOffset={mealPlanState.setCurrentWeekOffset}
        weekStartDate={mealPlanState.weekStartDate}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
        viewMode={mealPlanState.viewMode}
        setViewMode={mealPlanState.setViewMode}
        currentWeekPlan={mealPlanState.currentWeekPlan}
        todaysMeals={mealPlanState.todaysMeals}
        totalCalories={mealPlanState.totalCalories}
        totalProtein={mealPlanState.totalProtein}
        handleShowRecipe={handleShowRecipe}
        handleExchangeMeal={handleExchangeMeal}
        showAIDialog={mealPlanState.showAIDialog}
        setShowAIDialog={mealPlanState.setShowAIDialog}
        aiPreferences={mealPlanState.aiPreferences}
        setAiPreferences={mealPlanState.setAiPreferences}
        handleGenerateAIPlan={mealPlanState.handleGenerateAIPlan}
        showAddSnackDialog={mealPlanState.showAddSnackDialog}
        setShowAddSnackDialog={mealPlanState.setShowAddSnackDialog}
        refetch={mealPlanState.refetch}
        showShoppingListDialog={mealPlanState.showShoppingListDialog}
        setShowShoppingListDialog={mealPlanState.setShowShoppingListDialog}
        convertMealsToShoppingItems={convertMealsToShoppingItems}
        showRecipeDialog={mealPlanState.showRecipeDialog}
        setShowRecipeDialog={mealPlanState.setShowRecipeDialog}
        selectedMeal={mealPlanState.selectedMeal}
        showExchangeDialog={mealPlanState.showExchangeDialog}
        setShowExchangeDialog={mealPlanState.setShowExchangeDialog}
        selectedMealIndex={mealPlanState.selectedMealIndex}
        handleRecipeGenerated={mealPlanState.handleRecipeGenerated}
      />
    </ProtectedRoute>
  );
};

export default MealPlan;
