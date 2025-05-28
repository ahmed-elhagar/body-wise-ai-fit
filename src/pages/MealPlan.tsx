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
import Navigation from "@/components/Navigation";
import { useMealPlanLogic } from "@/hooks/useMealPlanLogic";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { formatDate, getCurrentDayOfWeek, transformDailyMealsToMeals } from "@/utils/mealPlanUtils";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Grid, Plus } from "lucide-react";

const MealPlan = () => {
  const { isGeneratingContent, hasExistingContent } = useInitialAIGeneration();
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

  const handleWeeklyMealExchange = (meal: any, dayNumber: number, mealIndex: number) => {
    // Convert to the format expected by the existing exchange handler
    const mealId = currentWeekPlan?.dailyMeals?.find(m => 
      m.day_number === dayNumber && 
      m.name === meal.name
    )?.id;
    
    setSelectedMeal({ current: meal, index: mealIndex, mealId });
    setShowExchangeDialog(true);
  };

  // Get diet type and weekly calories from the weekly plan
  const dietType = currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType || 
                   currentWeekPlan?.weeklyPlan?.generation_prompt?.preferences?.dietType;
  const totalWeeklyCalories = currentWeekPlan?.weeklyPlan?.total_calories;

  // Show loading screen only if data is being loaded AND we're not sure about existing content
  if (isLoading && hasExistingContent === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <Navigation />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meal plan...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show generation screen only if actively generating
  if (isGeneratingContent && hasExistingContent === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <Navigation />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your personalized meal plan...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSnackAdded = () => {
    // Refresh the meal plan data
    window.location.reload();
  };

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
            dietType={dietType}
            totalWeeklyCalories={totalWeeklyCalories}
          />

          <WeeklyNavigation
            currentWeekOffset={currentWeekOffset}
            onWeekChange={setCurrentWeekOffset}
            weekStartDate={currentWeekStart}
          />

          {/* View Mode Toggle and Add Snack Button */}
          {currentWeekPlan && (
            <div className="mb-6 flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg flex items-center gap-2">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'ghost'}
                  className={`${viewMode === 'daily' ? 'bg-fitness-gradient text-white' : ''}`}
                  onClick={() => setViewMode('daily')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Daily View
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  className={`${viewMode === 'weekly' ? 'bg-fitness-gradient text-white' : ''}`}
                  onClick={() => setViewMode('weekly')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Weekly View
                </Button>
                {viewMode === 'daily' && (
                  <Button
                    variant="outline"
                    className="ml-2 border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white"
                    onClick={() => setShowAddSnackDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Snack
                  </Button>
                )}
              </div>
            </div>
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
        </div>

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
      </div>
    </div>
  );
};

export default MealPlan;
