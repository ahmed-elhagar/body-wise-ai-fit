
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import MealPlanLayout from "@/components/MealPlanLayout";
import MealPlanLoadingScreen from "@/components/MealPlanLoadingScreen";
import MealPlanHeader from "@/components/MealPlanHeader";
import MealPlanMainContent from "@/components/MealPlanMainContent";
import MealPlanDialogs from "@/components/MealPlanDialogs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MealPlan = () => {
  const { t } = useLanguage();
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
    convertMealsToShoppingItems
  } = useMealPlanState();

  // Enhanced current date formatting
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Handle recipe generation callback to refresh UI
  const handleRecipeGenerated = () => {
    console.log('🔄 Recipe generated, refreshing meal plan data...');
    refetch();
  };

  // Enhanced debugging output for week-specific data
  console.log('🚀 MEAL PLAN PAGE - WEEK-SPECIFIC DEBUG:', {
    currentWeekOffset,
    weekStartDate: weekStartDate.toDateString(),
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    weeklyPlanId: currentWeekPlan?.weeklyPlan?.id,
    weeklyPlanDate: currentWeekPlan?.weeklyPlan?.week_start_date,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    todaysMealsCount: todaysMeals?.length || 0,
    selectedDay: selectedDayNumber,
    isLoading,
    error: error?.message
  });

  // Show loading state during generation OR shuffling
  if (isGenerating) {
    return (
      <MealPlanLoadingScreen message={t('generating')} />
    );
  }

  if (isShuffling) {
    return (
      <MealPlanLoadingScreen message="Shuffling your meals across the week..." />
    );
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <MealPlanLoadingScreen message={t('loading')} />
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <MealPlanLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-3">
              <p>Failed to load meal plan data. Please try again.</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </MealPlanLayout>
    );
  }

  return (
    <MealPlanLayout>
      <div className="space-y-4 sm:space-y-6">
        <MealPlanHeader
          currentDate={currentDate}
          currentDay={currentDay}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegeneratePlan={handleRegeneratePlan}
          isGenerating={isGenerating}
          isShuffling={isShuffling}
          dietType={currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType}
          totalWeeklyCalories={currentWeekPlan?.weeklyPlan?.total_calories}
        />

        <MealPlanMainContent
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDaySelect={setSelectedDayNumber}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddSnack={() => setShowAddSnackDialog(true)}
          onGenerate={() => setShowAIDialog(true)}
          currentWeekPlan={currentWeekPlan}
          todaysMeals={todaysMeals}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          onShowShoppingList={() => setShowShoppingListDialog(true)}
          onShowRecipe={handleShowRecipe}
          onExchangeMeal={handleExchangeMeal}
        />

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
          onSnackAdded={() => {
            refetch();
            setShowAddSnackDialog(false);
          }}
          currentDayCalories={totalCalories}
          targetDayCalories={2000}
          showShoppingListDialog={showShoppingListDialog}
          onCloseShoppingListDialog={() => setShowShoppingListDialog(false)}
          shoppingItems={convertMealsToShoppingItems(todaysMeals)}
          showRecipeDialog={showRecipeDialog}
          onCloseRecipeDialog={() => setShowRecipeDialog(false)}
          selectedMeal={selectedMeal}
          showExchangeDialog={showExchangeDialog}
          onCloseExchangeDialog={() => setShowExchangeDialog(false)}
          selectedMealIndex={selectedMealIndex}
          onExchange={() => {
            refetch();
            setShowExchangeDialog(false);
          }}
          onRecipeGenerated={handleRecipeGenerated}
        />
      </div>
    </MealPlanLayout>
  );
};

export default MealPlan;
