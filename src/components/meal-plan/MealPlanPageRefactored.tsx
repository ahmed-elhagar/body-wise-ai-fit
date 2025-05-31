
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import MealPlanHero from "./MealPlanHero";
import DayTabs from "./DayTabs";
import MealGrid from "./MealGrid";
import QuickStatsCard from "./QuickStatsCard";
import WeeklyView from "./WeeklyView";
import EmptyState from "./EmptyState";
import ShoppingListDrawer from "../shopping-list/ShoppingListDrawer";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
import SnackPickerDialog from "./SnackPickerDialog";
import MealPlanAIDialog from "./MealPlanAIDialog";
import ViewModeToggle from "./ViewModeToggle";
import { toast } from "sonner";

const MealPlanPageRefactored = () => {
  const { mealPlanT } = useMealPlanTranslation();
  const mealPlanState = useMealPlanState();
  
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [showSnackDialog, setShowSnackDialog] = useState(false);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState(1);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Get current week dates for display
  const weekDays = [
    { number: 1, name: 'Saturday', date: mealPlanState.weekStartDate },
    { number: 2, name: 'Sunday', date: addDays(mealPlanState.weekStartDate, 1) },
    { number: 3, name: 'Monday', date: addDays(mealPlanState.weekStartDate, 2) },
    { number: 4, name: 'Tuesday', date: addDays(mealPlanState.weekStartDate, 3) },
    { number: 5, name: 'Wednesday', date: addDays(mealPlanState.weekStartDate, 4) },
    { number: 6, name: 'Thursday', date: addDays(mealPlanState.weekStartDate, 5) },
    { number: 7, name: 'Friday', date: addDays(mealPlanState.weekStartDate, 6) }
  ];

  // Calculate weekly stats from processed data
  const weeklyStats = {
    totalCalories: mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0,
    totalProtein: mealPlanState.currentWeekPlan?.weeklyPlan?.total_protein || 0,
    avgDailyCalories: Math.round((mealPlanState.currentWeekPlan?.weeklyPlan?.total_calories || 0) / 7),
    totalMeals: mealPlanState.currentWeekPlan?.dailyMeals?.length || 0
  };

  const handleAddSnack = (dayNumber: number) => {
    setSelectedDayForSnack(dayNumber);
    setShowSnackDialog(true);
  };

  const handleSnackAdded = async () => {
    setShowSnackDialog(false);
    await mealPlanState.refetch();
    toast.success(mealPlanT('snackAddedSuccess'));
  };

  const handleShoppingListUpdate = () => {
    toast.success(mealPlanT('shoppingListUpdated'));
  };

  const handleRegeneratePlan = async () => {
    try {
      await mealPlanState.handleRegeneratePlan();
      toast.success(mealPlanT('planGeneratedSuccess'));
    } catch (error) {
      console.error('❌ Regeneration failed:', error);
      toast.error(mealPlanT('planGenerationFailed'));
    }
  };

  const handleGenerateAIPlan = async () => {
    console.log('🎯 MealPlanPage: Starting AI generation with preferences:', mealPlanState.aiPreferences);
    
    try {
      const success = await mealPlanState.handleGenerateAIPlan();
      if (success) {
        mealPlanState.setShowAIDialog(false);
        toast.success(mealPlanT('planGeneratedSuccess'));
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      toast.error(mealPlanT('planGenerationFailed'));
    }
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message={mealPlanT('loading')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message={mealPlanT('generating')}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 lg:py-6 space-y-4 lg:space-y-6">
        {/* Enhanced Hero Header */}
        <MealPlanHero
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
          weeklyStats={weeklyStats}
          hasWeeklyPlan={!!mealPlanState.currentWeekPlan}
        />

        {mealPlanState.currentWeekPlan ? (
          <>
            {/* Control Bar with Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <ViewModeToggle 
                viewMode={viewMode} 
                onViewModeChange={setViewMode} 
              />
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {mealPlanT('addSnack')}
                </button>
                
                <button
                  onClick={() => setShowShoppingDrawer(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.2M16 18a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {mealPlanT('shoppingList')}
                </button>
              </div>
            </div>

            {viewMode === 'weekly' ? (
              <WeeklyView
                weekStartDate={mealPlanState.weekStartDate}
                currentWeekPlan={mealPlanState.currentWeekPlan}
                onSelectDay={mealPlanState.setSelectedDayNumber}
                onSwitchToDaily={() => setViewMode('daily')}
              />
            ) : (
              <div className="space-y-6">
                {/* Mobile Layout: Stack vertically */}
                <div className="block xl:hidden space-y-6">
                  {/* Day Tabs - Mobile */}
                  <DayTabs
                    weekStartDate={mealPlanState.weekStartDate}
                    selectedDayNumber={mealPlanState.selectedDayNumber}
                    onDayChange={mealPlanState.setSelectedDayNumber}
                  />

                  {/* Quick Stats - Mobile - Below tabs */}
                  <QuickStatsCard
                    totalCalories={mealPlanState.totalCalories}
                    totalProtein={mealPlanState.totalProtein}
                    targetDayCalories={mealPlanState.targetDayCalories}
                    mealCount={mealPlanState.todaysMeals?.length || 0}
                  />

                  {/* Meal Content - Mobile */}
                  <Tabs value={mealPlanState.selectedDayNumber.toString()}>
                    {weekDays.map((day) => (
                      <TabsContent key={day.number} value={day.number.toString()}>
                        <MealGrid
                          meals={mealPlanState.currentWeekPlan?.dailyMeals?.filter(
                            meal => meal.day_number === day.number
                          ) || []}
                          onShowRecipe={mealPlanState.handleShowRecipe}
                          onExchangeMeal={mealPlanState.handleExchangeMeal}
                          onAddSnack={() => handleAddSnack(day.number)}
                          onShowShoppingList={() => setShowShoppingDrawer(true)}
                          onRegeneratePlan={handleRegeneratePlan}
                          dayNumber={day.number}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Desktop Layout: Sidebar + Main Content */}
                <div className="hidden xl:grid xl:grid-cols-12 gap-6">
                  {/* Sidebar - Stats */}
                  <div className="xl:col-span-3 space-y-6 sticky top-6 self-start">
                    <QuickStatsCard
                      totalCalories={mealPlanState.totalCalories}
                      totalProtein={mealPlanState.totalProtein}
                      targetDayCalories={mealPlanState.targetDayCalories}
                      mealCount={mealPlanState.todaysMeals?.length || 0}
                    />
                  </div>

                  {/* Main Content */}
                  <div className="xl:col-span-9 space-y-6">
                    {/* Day Tabs */}
                    <DayTabs
                      weekStartDate={mealPlanState.weekStartDate}
                      selectedDayNumber={mealPlanState.selectedDayNumber}
                      onDayChange={mealPlanState.setSelectedDayNumber}
                    />

                    {/* Meal Content */}
                    <Tabs value={mealPlanState.selectedDayNumber.toString()}>
                      {weekDays.map((day) => (
                        <TabsContent key={day.number} value={day.number.toString()}>
                          <MealGrid
                            meals={mealPlanState.currentWeekPlan?.dailyMeals?.filter(
                              meal => meal.day_number === day.number
                            ) || []}
                            onShowRecipe={mealPlanState.handleShowRecipe}
                            onExchangeMeal={mealPlanState.handleExchangeMeal}
                            onAddSnack={() => handleAddSnack(day.number)}
                            onShowShoppingList={() => setShowShoppingDrawer(true)}
                            onRegeneratePlan={handleRegeneratePlan}
                            dayNumber={day.number}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState onGeneratePlan={() => mealPlanState.setShowAIDialog(true)} />
        )}
      </div>

      {/* Dialogs */}
      <MealPlanAIDialog
        open={mealPlanState.showAIDialog}
        onOpenChange={mealPlanState.setShowAIDialog}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
      />

      <SnackPickerDialog
        isOpen={showSnackDialog}
        onClose={() => setShowSnackDialog(false)}
        dayNumber={selectedDayForSnack}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={handleSnackAdded}
      />

      <ShoppingListDrawer
        isOpen={showShoppingDrawer}
        onClose={() => setShowShoppingDrawer(false)}
        weeklyPlan={mealPlanState.currentWeekPlan}
        weekId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={handleShoppingListUpdate}
      />

      {mealPlanState.selectedMeal && (
        <MealRecipeDialog
          isOpen={mealPlanState.showRecipeDialog}
          onClose={() => mealPlanState.setShowRecipeDialog(false)}
          meal={mealPlanState.selectedMeal}
          onRecipeGenerated={mealPlanState.handleRecipeGenerated}
        />
      )}

      {mealPlanState.selectedMeal && (
        <MealExchangeDialog
          isOpen={mealPlanState.showExchangeDialog}
          onClose={() => mealPlanState.setShowExchangeDialog(false)}
          currentMeal={mealPlanState.selectedMeal}
          onExchange={mealPlanState.handleRegeneratePlan}
        />
      )}
    </div>
  );
};

export default MealPlanPageRefactored;
