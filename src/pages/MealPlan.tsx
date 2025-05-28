
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
import Navigation from "@/components/Navigation";
import { useMealPlanLogic } from "@/hooks/useMealPlanLogic";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { formatDate, getCurrentDayOfWeek, transformDailyMealsToMeals } from "@/utils/mealPlanUtils";
import { toast } from "sonner";

const MealPlan = () => {
  const { isGeneratingContent } = useInitialAIGeneration();
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
    handleShowShoppingList
  } = useMealPlanLogic();

  // Calculate current date and week
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));

  // Get meals for selected day
  const todaysMeals = transformDailyMealsToMeals(currentWeekPlan?.dailyMeals || [], selectedDayNumber);

  // Calculate weekly overview from actual data
  const getDayCalories = (dayNumber: number): number => {
    if (!currentWeekPlan?.dailyMeals) return 0;
    return currentWeekPlan.dailyMeals
      .filter(meal => meal.day_number === dayNumber)
      .reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  const weeklyOverview = [
    { day: "Mon", calories: getDayCalories(1), status: selectedDayNumber === 1 ? "current" as const : "planned" as const },
    { day: "Tue", calories: getDayCalories(2), status: selectedDayNumber === 2 ? "current" as const : "planned" as const },
    { day: "Wed", calories: getDayCalories(3), status: selectedDayNumber === 3 ? "current" as const : "planned" as const },
    { day: "Thu", calories: getDayCalories(4), status: selectedDayNumber === 4 ? "current" as const : "planned" as const },
    { day: "Fri", calories: getDayCalories(5), status: selectedDayNumber === 5 ? "current" as const : "planned" as const },
    { day: "Sat", calories: getDayCalories(6), status: selectedDayNumber === 6 ? "current" as const : "planned" as const },
    { day: "Sun", calories: getDayCalories(7), status: selectedDayNumber === 7 ? "current" as const : "planned" as const }
  ];

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);

  // Show loading screen if data is being loaded or initial content is being generated
  if (isLoading || isGeneratingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <Navigation />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isGeneratingContent ? "Generating your personalized meal plan..." : "Loading meal plan..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Navigation />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <MealPlanHeader
            currentDate={formatDate(today)}
            currentDay={getCurrentDayOfWeek()}
            onShowAIDialog={() => setShowAIDialog(true)}
            onRegeneratePlan={handleRegeneratePlan}
            isGenerating={isGenerating}
          />

          <WeeklyNavigation
            currentWeekOffset={currentWeekOffset}
            onWeekChange={setCurrentWeekOffset}
            weekStartDate={currentWeekStart}
          />

          <DaySelector
            selectedDayNumber={selectedDayNumber}
            onDaySelect={setSelectedDayNumber}
          />

          {currentWeekPlan && todaysMeals.length > 0 ? (
            <MealPlanContent
              selectedDayNumber={selectedDayNumber}
              todaysMeals={todaysMeals}
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              onShowShoppingList={handleShowShoppingList}
              onShowRecipe={handleShowRecipe}
              onExchangeMeal={handleExchangeMeal}
            />
          ) : (
            <EmptyMealPlan onShowAIDialog={() => setShowAIDialog(true)} />
          )}

          <WeeklyOverview weeklyData={weeklyOverview} />
        </div>

        <AIGenerationDialog
          isOpen={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          preferences={aiPreferences}
          onPreferencesChange={setAiPreferences}
          onGenerate={handleGenerateAIPlan}
          isGenerating={isGenerating}
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
          alternatives={selectedMeal?.alternatives || []}
          isOpen={showExchangeDialog}
          onClose={() => setShowExchangeDialog(false)}
          onExchange={() => toast.success("Meal exchanged successfully!")}
        />
      </div>
    </div>
  );
};

export default MealPlan;
