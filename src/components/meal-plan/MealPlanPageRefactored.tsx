
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
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MealPlanPageRefactored = () => {
  const { t, isRTL } = useLanguage();
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
    toast.success("Snack added and shopping list updated ✅");
  };

  const handleShoppingListUpdate = () => {
    toast.success("Shopping list updated ✅");
  };

  const handleRegeneratePlan = async () => {
    try {
      await mealPlanState.handleRegeneratePlan();
      toast.success("Meal plan regenerated successfully! 🎉");
    } catch (error) {
      console.error('❌ Regeneration failed:', error);
      toast.error("Failed to regenerate meal plan. Please try again.");
    }
  };

  // Enhanced AI generation handler
  const handleGenerateAIPlan = async () => {
    console.log('🎯 MealPlanPage: Starting AI generation with preferences:', mealPlanState.aiPreferences);
    
    try {
      const success = await mealPlanState.handleGenerateAIPlan();
      if (success) {
        mealPlanState.setShowAIDialog(false);
        toast.success("Meal plan generated successfully! 🎉");
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      toast.error("Failed to generate meal plan. Please try again.");
    }
  };

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingBackdrop isLoading={true} message="Loading your meal plan..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message="Generating your meal plan..."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <MealPlanHeader
          weekStartDate={mealPlanState.weekStartDate}
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
          onShowShoppingList={() => setShowShoppingDrawer(true)}
          onRegeneratePlan={handleRegeneratePlan}
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 order-1 space-y-6">
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

                {/* Sidebar Stats - Moved to right */}
                <div className="lg:col-span-1 order-2">
                  <StatsSidebar
                    todaysMeals={mealPlanState.todaysMeals || []}
                    totalCalories={mealPlanState.totalCalories}
                    totalProtein={mealPlanState.totalProtein}
                    targetDayCalories={mealPlanState.targetDayCalories}
                    onAddSnack={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                    onRegeneratePlan={handleRegeneratePlan}
                  />
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

export default MealPlanPageRefactored;
