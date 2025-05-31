
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import { Container, Section, ContentArea, Grid, Flex } from "@/components/ui/layout";
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
    <div className="min-h-screen bg-gradient-to-br from-fitness-neutral-50 via-fitness-primary-50/30 to-fitness-accent-50/30">
      <MealPlanLoadingBackdrop 
        isLoading={mealPlanState.isGenerating} 
        message={mealPlanT('generating')}
      />
      
      <Container className="py-3 lg:py-6">
        <ContentArea>
          {/* Enhanced Hero Header */}
          <Section>
            <MealPlanHero
              weekStartDate={mealPlanState.weekStartDate}
              currentWeekOffset={mealPlanState.currentWeekOffset}
              onWeekChange={mealPlanState.setCurrentWeekOffset}
              onShowAIDialog={() => mealPlanState.setShowAIDialog(true)}
              weeklyStats={weeklyStats}
              hasWeeklyPlan={!!mealPlanState.currentWeekPlan}
              weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
            />
          </Section>

          {mealPlanState.currentWeekPlan ? (
            <>
              {/* Control Bar with Action Buttons */}
              <Section>
                <div className="card-enhanced card-padding">
                  <Flex justify="between" wrap className="gap-4">
                    <ViewModeToggle 
                      viewMode={viewMode} 
                      onViewModeChange={setViewMode} 
                    />
                    
                    <Flex gap={3} wrap>
                      <button
                        onClick={() => handleAddSnack(mealPlanState.selectedDayNumber)}
                        className="touch-target flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 text-white rounded-xl hover:from-fitness-orange-600 hover:to-fitness-orange-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {mealPlanT('addSnack')}
                      </button>
                      
                      <button
                        onClick={() => setShowShoppingDrawer(true)}
                        className="touch-target flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white rounded-xl hover:from-fitness-accent-600 hover:to-fitness-accent-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.2M16 18a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {mealPlanT('shoppingList')}
                      </button>

                      <button
                        onClick={() => mealPlanState.setShowAIDialog(true)}
                        className="touch-target flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white rounded-xl hover:from-fitness-primary-600 hover:to-fitness-primary-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {mealPlanT('generateAIPlan')}
                      </button>
                    </Flex>
                  </Flex>
                </div>
              </Section>

              {viewMode === 'weekly' ? (
                <Section>
                  <WeeklyView
                    weekStartDate={mealPlanState.weekStartDate}
                    currentWeekPlan={mealPlanState.currentWeekPlan}
                    onSelectDay={mealPlanState.setSelectedDayNumber}
                    onSwitchToDaily={() => setViewMode('daily')}
                  />
                </Section>
              ) : (
                <ContentArea>
                  {/* Mobile Layout: Stack vertically */}
                  <div className="block xl:hidden">
                    <ContentArea>
                      {/* Day Tabs - Mobile */}
                      <Section>
                        <DayTabs
                          weekStartDate={mealPlanState.weekStartDate}
                          selectedDayNumber={mealPlanState.selectedDayNumber}
                          onDayChange={mealPlanState.setSelectedDayNumber}
                        />
                      </Section>

                      {/* Quick Stats - Mobile - Below tabs */}
                      <Section>
                        <QuickStatsCard
                          totalCalories={mealPlanState.totalCalories}
                          totalProtein={mealPlanState.totalProtein}
                          targetDayCalories={mealPlanState.targetDayCalories}
                          mealCount={mealPlanState.todaysMeals?.length || 0}
                        />
                      </Section>

                      {/* Meal Content - Mobile */}
                      <Section>
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
                      </Section>
                    </ContentArea>
                  </div>

                  {/* Desktop Layout: Sidebar + Main Content */}
                  <div className="hidden xl:grid xl:grid-cols-12 gap-6">
                    {/* Enhanced Sidebar - Stats */}
                    <div className="xl:col-span-3">
                      <div className="sticky top-6 space-y-6">
                        <QuickStatsCard
                          totalCalories={mealPlanState.totalCalories}
                          totalProtein={mealPlanState.totalProtein}
                          targetDayCalories={mealPlanState.targetDayCalories}
                          mealCount={mealPlanState.todaysMeals?.length || 0}
                        />
                        
                        {/* Enhanced AI Generation Card */}
                        <div className="bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 rounded-2xl border-2 border-fitness-primary-200 p-6 shadow-lg">
                          <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-xl flex items-center justify-center mx-auto">
                              <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="font-semibold text-fitness-primary-800">
                              AI Meal Planning
                            </h3>
                            <p className="text-sm text-fitness-primary-600">
                              Generate personalized meal plans with AI
                            </p>
                            <button
                              onClick={() => mealPlanState.setShowAIDialog(true)}
                              className="w-full bg-gradient-to-r from-fitness-primary-500 to-fitness-secondary-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              Generate New Plan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="xl:col-span-9">
                      <ContentArea>
                        {/* Day Tabs */}
                        <Section>
                          <DayTabs
                            weekStartDate={mealPlanState.weekStartDate}
                            selectedDayNumber={mealPlanState.selectedDayNumber}
                            onDayChange={mealPlanState.setSelectedDayNumber}
                          />
                        </Section>

                        {/* Meal Content */}
                        <Section>
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
                        </Section>
                      </ContentArea>
                    </div>
                  </div>
                </ContentArea>
              )}
            </>
          ) : (
            <Section>
              <EmptyState onGeneratePlan={() => mealPlanState.setShowAIDialog(true)} />
            </Section>
          )}
        </ContentArea>
      </Container>

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
