
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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Grid, Plus, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const MealPlan = () => {
  const { isGeneratingContent, hasExistingContent } = useInitialAIGeneration();
  const { t, isRTL } = useLanguage();
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
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navigation />
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t('mealPlan.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show generation screen only if actively generating
  if (isGeneratingContent && hasExistingContent === false) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navigation />
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t('mealPlan.generating')}</p>
          </div>
        </div>
      </div>
    );
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} transition-all duration-300`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-8">
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
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg w-full max-w-4xl">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex flex-1">
                    <Button
                      variant={viewMode === 'daily' ? 'default' : 'ghost'}
                      className={`flex-1 text-sm transition-all duration-200 ${
                        viewMode === 'daily' 
                          ? 'bg-fitness-gradient text-white shadow-md' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setViewMode('daily')}
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('mealPlan.dailyView')}
                    </Button>
                    <Button
                      variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                      className={`flex-1 text-sm transition-all duration-200 ${
                        viewMode === 'weekly' 
                          ? 'bg-fitness-gradient text-white shadow-md' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setViewMode('weekly')}
                      size="sm"
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      {t('mealPlan.weeklyView')}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 lg:gap-3">
                    {viewMode === 'daily' && (
                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-initial lg:min-w-[140px] text-sm border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200"
                        onClick={() => setShowAddSnackDialog(true)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('mealPlan.addSnack')}
                      </Button>
                    )}
                    
                    <Button
                      className="flex-1 lg:flex-initial lg:min-w-[160px] text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
                      onClick={handleFinalizeMealPlan}
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('mealPlan.finalizePlan')}
                    </Button>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default MealPlan;
