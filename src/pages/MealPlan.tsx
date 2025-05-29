
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import MealPlanLoadingStates from "@/components/meal-plan/MealPlanLoadingStates";
import MealPlanErrorState from "@/components/meal-plan/MealPlanErrorState";
import MealPlanPageContent from "@/components/meal-plan/MealPlanPageContent";

const MealPlan = () => {
  const {
    // State
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    viewMode,
    setViewMode,
    showAIDialog,
    setShowAIDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    selectedMealIndex,
    aiPreferences,
    setAiPreferences,
    
    // Data
    currentWeekPlan,
    isLoading,
    isGenerating,
    isShuffling,
    weekStartDate,
    todaysMeals,
    totalCalories,
    totalProtein,
    error,
    
    // Handlers
    handleRegeneratePlan,
    handleGenerateAIPlan,
    handleShowRecipe,
    handleExchangeMeal,
    refetch,
    convertMealsToShoppingItems,
    
    // New properties
    currentDate,
    currentDay,
    handleRecipeGenerated
  } = useMealPlanPage();

  console.log('🎯 MealPlan Page - Debug State:', {
    currentWeekOffset,
    hasCurrentWeekPlan: !!currentWeekPlan,
    isLoading,
    isGenerating,
    isShuffling,
    todaysMealsCount: todaysMeals?.length || 0,
    error: error?.message
  });

  // Check if we should show loading states
  const shouldShowLoading = isLoading || isGenerating || isShuffling;
  
  if (shouldShowLoading) {
    return (
      <MealPlanLoadingStates
        isGenerating={isGenerating}
        isShuffling={isShuffling}
        isLoading={isLoading}
      />
    );
  }

  // Show error state if there's an error
  if (error) {
    console.error('🚨 MealPlan Page - Error detected:', error);
    return <MealPlanErrorState onRetry={refetch} />;
  }

  return (
    <MealPlanPageContent
      currentDate={currentDate}
      currentDay={currentDay}
      onShowAIDialog={() => setShowAIDialog(true)}
      onRegeneratePlan={handleRegeneratePlan}
      isGenerating={isGenerating}
      isShuffling={isShuffling}
      dietType={currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType}
      totalWeeklyCalories={currentWeekPlan?.weeklyPlan?.total_calories}
      currentWeekOffset={currentWeekOffset}
      setCurrentWeekOffset={setCurrentWeekOffset}
      weekStartDate={weekStartDate}
      selectedDayNumber={selectedDayNumber}
      setSelectedDayNumber={setSelectedDayNumber}
      viewMode={viewMode}
      setViewMode={setViewMode}
      currentWeekPlan={currentWeekPlan}
      todaysMeals={todaysMeals}
      totalCalories={totalCalories}
      totalProtein={totalProtein}
      handleShowRecipe={handleShowRecipe}
      handleExchangeMeal={handleExchangeMeal}
      showAIDialog={showAIDialog}
      setShowAIDialog={setShowAIDialog}
      aiPreferences={aiPreferences}
      setAiPreferences={setAiPreferences}
      handleGenerateAIPlan={handleGenerateAIPlan}
      showAddSnackDialog={showAddSnackDialog}
      setShowAddSnackDialog={setShowAddSnackDialog}
      refetch={refetch}
      showShoppingListDialog={showShoppingListDialog}
      setShowShoppingListDialog={setShowShoppingListDialog}
      convertMealsToShoppingItems={convertMealsToShoppingItems}
      showRecipeDialog={showRecipeDialog}
      setShowRecipeDialog={setShowRecipeDialog}
      selectedMeal={selectedMeal}
      showExchangeDialog={showExchangeDialog}
      setShowExchangeDialog={setShowExchangeDialog}
      selectedMealIndex={selectedMealIndex}
      handleRecipeGenerated={handleRecipeGenerated}
    />
  );
};

export default MealPlan;
