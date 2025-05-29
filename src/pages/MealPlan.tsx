
import MealRecipeDialog from "@/components/MealRecipeDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import MealPlanHeader from "@/components/MealPlanHeader";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import WeeklyOverview from "@/components/WeeklyOverview";
import WeeklyNavigation from "@/components/WeeklyNavigation";
import DaySelector from "@/components/DaySelector";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import MealPlanContent from "@/components/MealPlanContent";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import AddSnackDialog from "@/components/AddSnackDialog";
import MealPlanActions from "@/components/MealPlanActions";
import MealPlanLoadingScreen from "@/components/MealPlanLoadingScreen";
import MealPlanLayout from "@/components/MealPlanLayout";
import { useMealPlanLogic } from "@/hooks/useMealPlanLogic";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { formatDate, getCurrentDayOfWeek, transformDailyMealsToMeals } from "@/utils/mealPlanUtils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MealPlan = () => {
  const { isGeneratingContent, hasExistingContent } = useInitialAIGeneration();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  
  const {
    showAIDialog,
    selectedMeal,
    showRecipeDialog,
    showShoppingDialog,
    showExchangeDialog,
    currentWeekOffset,
    selectedDayNumber,
    aiPreferences,
    currentWeekPlan,
    isLoading,
    isGenerating,
    setShowAIDialog,
    setSelectedMeal,
    setShowRecipeDialog,
    setShowShoppingDialog,
    setShowExchangeDialog,
    setCurrentWeekOffset,
    setSelectedDayNumber,
    setAiPreferences,
    handleGenerateAIPlan,
    handleRegeneratePlan,
    handleShowRecipe,
    handleExchangeMeal,
    handleMealExchange,
    handleShowShoppingList
  } = useMealPlanLogic();

  // Auto-select current day when component mounts
  useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    setSelectedDayNumber(currentDay);
  }, [setSelectedDayNumber]);

  // Calculate current date and week (starting from Saturday)
  const today = new Date();
  const currentWeekStart = new Date(today);
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysSinceSaturday = currentDay === 6 ? 0 : currentDay + 1;
  currentWeekStart.setDate(today.getDate() - daysSinceSaturday + (currentWeekOffset * 7));

  // Get meals for selected day
  const todaysMeals = transformDailyMealsToMeals(currentWeekPlan?.dailyMeals || [], selectedDayNumber);

  // Calculate daily calories
  const getDayCalories = (dayNumber: number): number => {
    if (!currentWeekPlan?.dailyMeals) return 0;
    return currentWeekPlan.dailyMeals
      .filter(meal => meal.day_number === dayNumber)
      .reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  const currentDayCalories = getDayCalories(selectedDayNumber);
  const targetDayCalories = currentWeekPlan?.weeklyPlan?.total_calories ? 
    Math.round(currentWeekPlan.weeklyPlan.total_calories / 7) : 2000;

  // Calculate weekly overview from actual data
  const weeklyOverview = [
    { day: "Sat", calories: getDayCalories(1), status: selectedDayNumber === 1 ? "current" as const : "planned" as const },
    { day: "Sun", calories: getDayCalories(2), status: selectedDayNumber === 2 ? "current" as const : "planned" as const },
    { day: "Mon", calories: getDayCalories(3), status: selectedDayNumber === 3 ? "current" as const : "planned" as const },
    { day: "Tue", calories: getDayCalories(4), status: selectedDayNumber === 4 ? "current" as const : "planned" as const },
    { day: "Wed", calories: getDayCalories(5), status: selectedDayNumber === 5 ? "current" as const : "planned" as const },
    { day: "Thu", calories: getDayCalories(6), status: selectedDayNumber === 6 ? "current" as const : "planned" as const },
    { day: "Fri", calories: getDayCalories(7), status: selectedDayNumber === 7 ? "current" as const : "planned" as const }
  ];

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);

  const handleWeeklyMealExchange = (meal: any, dayNumber: number, mealIndex: number) => {
    const mealId = currentWeekPlan?.dailyMeals?.find(m => 
      m.day_number === dayNumber && 
      m.name === meal.name
    )?.id;
    
    setSelectedMeal({ current: meal, index: mealIndex, mealId });
    setShowExchangeDialog(true);
  };

  const dietType = currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType || 
                   currentWeekPlan?.weeklyPlan?.generation_prompt?.preferences?.dietType;
  const totalWeeklyCalories = currentWeekPlan?.weeklyPlan?.total_calories;

  // Show loading screen only if data is being loaded AND we're not sure about existing content
  if (isLoading && hasExistingContent === null) {
    return <MealPlanLoadingScreen message={t('mealPlan.loading')} />;
  }

  // Show generation screen only if actively generating
  if (isGeneratingContent && hasExistingContent === false) {
    return <MealPlanLoadingScreen message={t('mealPlan.generating')} />;
  }

  const handleSnackAdded = () => {
    window.location.reload();
  };

  const handleFinalizeMealPlan = () => {
    if (!currentWeekPlan) {
      toast.error(t('mealPlan.noActivePlan'));
      return;
    }
    
    toast.success(t('mealPlan.planFinalized'));
    // Here you could navigate to the next step of the app
    // For example: navigate('/exercise-plan') or whatever the next step is
  };

  return (
    <MealPlanLayout>
      <MealPlanHeader
        currentDate={formatDate(today)}
        currentDay={getCurrentDayOfWeek()}
        onShowAIDialog={() => setShowAIDialog(true)}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        dietType={dietType}
        totalWeeklyCalories={totalWeeklyCalories}
      />

      <WeeklyNavigation
        currentWeekOffset={currentWeekOffset}
        onWeekChange={setCurrentWeekOffset}
        weekStartDate={currentWeekStart}
      />

      {/* Enhanced View Mode Toggle and Actions */}
      {currentWeekPlan && (
        <MealPlanActions
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddSnack={() => setShowAddSnackDialog(true)}
          onFinalizePlan={handleFinalizeMealPlan}
          showAddSnack={viewMode === 'daily'}
        />
      )}

      {currentWeekPlan && todaysMeals.length > 0 ? (
        <>
          {viewMode === 'daily' && (
            <>
              <DaySelector
                selectedDayNumber={selectedDayNumber}
                onDaySelect={setSelectedDayNumber}
              />
              <MealPlanContent
                selectedDayNumber={selectedDayNumber}
                todaysMeals={todaysMeals}
                totalCalories={totalCalories}
                totalProtein={totalProtein}
                onShowShoppingList={handleShowShoppingList}
                onShowRecipe={handleShowRecipe}
                onExchangeMeal={handleExchangeMeal}
              />
            </>
          )}
          
          {viewMode === 'weekly' && (
            <WeeklyMealPlanView
              weeklyPlan={currentWeekPlan}
              onShowRecipe={handleShowRecipe}
              onExchangeMeal={handleWeeklyMealExchange}
            />
          )}
        </>
      ) : (
        <EmptyMealPlan onShowAIDialog={() => setShowAIDialog(true)} />
      )}

      {viewMode === 'daily' && (
        <WeeklyOverview weeklyData={weeklyOverview} />
      )}

      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        preferences={aiPreferences}
        onPreferencesChange={setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => setShowAddSnackDialog(false)}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={handleSnackAdded}
        currentDayCalories={currentDayCalories}
        targetDayCalories={targetDayCalories}
      />

      <MealRecipeDialog
        meal={selectedMeal}
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
      />

      <ShoppingListDialog
        items={selectedMeal?.items || []}
        isOpen={showShoppingDialog}
        onClose={() => setShowShoppingDialog(false)}
      />

      <MealExchangeDialog
        currentMeal={selectedMeal?.current}
        isOpen={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        onExchange={handleMealExchange}
      />
    </MealPlanLayout>
  );
};

export default MealPlan;
