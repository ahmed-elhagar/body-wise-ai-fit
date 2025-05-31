import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import MealPlanHeader from "./MealPlanHeader";
import DayTabs from "./DayTabs";
import MealGrid from "./MealGrid";
import StatsSidebar from "./StatsSidebar";
import WeeklyView from "./WeeklyView";
import EmptyState from "./EmptyState";
import ShoppingListDrawer from "../shopping-list/ShoppingListDrawer";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
import SnackPickerDialog from "./SnackPickerDialog";
import MealPlanAIDialog from "./MealPlanAIDialog";
import { toast } from "sonner";

const MealPlanPage = () => {
  const { t, isRTL } = useLanguage();
  const mealPlanState = useMealPlanState();
  
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [showSnackDialog, setShowSnackDialog] = useState(false);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState(1);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Get current week dates for display
  const weekDays = [
    { number: 1, name: t('mealPlan.saturday'), date: mealPlanState.weekStartDate },
    { number: 2, name: t('mealPlan.sunday'), date: addDays(mealPlanState.weekStartDate, 1) },
    { number: 3, name: t('mealPlan.monday'), date: addDays(mealPlanState.weekStartDate, 2) },
    { number: 4, name: t('mealPlan.tuesday'), date: addDays(mealPlanState.weekStartDate, 3) },
    { number: 5, name: t('mealPlan.wednesday'), date: addDays(mealPlanState.weekStartDate, 4) },
    { number: 6, name: t('mealPlan.thursday'), date: addDays(mealPlanState.weekStartDate, 5) },
    { number: 7, name: t('mealPlan.friday'), date: addDays(mealPlanState.weekStartDate, 6) }
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
    toast.success(t('mealPlan.snackAddedSuccess'));
  };

  const handleShoppingListUpdate = () => {
    toast.success(t('mealPlan.shoppingListUpdated'));
  };

  // Enhanced AI generation handler
  const handleGenerateAIPlan = async () => {
    console.log('🎯 MealPlanPage: Starting AI generation with preferences:', mealPlanState.aiPreferences);
    
    try {
      const success = await mealPlanState.handleGenerateAIPlan();
      if (success) {
        mealPlanState.setShowAIDialog(false);
        toast.success(t('mealPlan.planGeneratedSuccess'));
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      toast.error(t('mealPlan.planGenerationFailed'));
    }
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message={t('mealPlan.loading')} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message={t('mealPlan.generating')}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <MealPlanHeader
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
          onShowShoppingList={() => setShowShoppingDrawer(true)}
          onRegeneratePlan={mealPlanState.handleRegeneratePlan}
          weeklyStats={weeklyStats}
          hasWeeklyPlan={!!mealPlanState.currentWeekPlan}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {mealPlanState.currentWeekPlan ? (
          <>
            {viewMode === 'weekly' ? (
              <WeeklyView
                weekStartDate={mealPlanState.weekStartDate}
                currentWeekPlan={mealPlanState.currentWeekPlan}
                onSelectDay={mealPlanState.setSelectedDayNumber}
                onSwitchToDaily={() => setViewMode('daily')}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sidebar Stats */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <StatsSidebar
                    todaysMeals={mealPlanState.todaysMeals || []}
                    totalCalories={mealPlanState.totalCalories}
                    totalProtein={mealPlanState.totalProtein}
                    targetDayCalories={mealPlanState.targetDayCalories}
                    onAddSnack={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                    onRegeneratePlan={() => mealPlanState.setShowAIDialog(true)}
                  />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
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
                          dayNumber={day.number}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState onGeneratePlan={() => mealPlanState.setShowAIDialog(true)} />
        )}
      </div>

      {/* AI Generation Dialog */}
      <MealPlanAIDialog
        open={mealPlanState.showAIDialog}
        onOpenChange={mealPlanState.setShowAIDialog}
        preferences={mealPlanState.aiPreferences}
        onPreferencesChange={mealPlanState.setAiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
      />

      {/* Other Dialogs */}
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

export default MealPlanPage;
