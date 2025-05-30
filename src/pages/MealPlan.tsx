
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChefHat, Clock, Users, Shuffle, Sparkles, UtensilsCrossed, Apple } from "lucide-react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { useLanguage } from "@/contexts/LanguageContext";
import MealPlanWeekNavigation from "@/components/meal-plan/MealPlanWeekNavigation";
import MealPlanDaySelector from "@/components/meal-plan/MealPlanDaySelector";
import MealPlanLoadingState from "@/components/meal-plan/MealPlanLoadingState";
import MealPlanEmptyState from "@/components/meal-plan/MealPlanEmptyState";
import MealPlanStatsCard from "@/components/meal-plan/MealPlanStatsCard";
import MealPlanDayContent from "@/components/meal-plan/MealPlanDayContent";
import MealPlanRecipeDialog from "@/components/meal-plan/MealPlanRecipeDialog";
import MealPlanExchangeDialog from "@/components/meal-plan/MealPlanExchangeDialog";
import MealPlanAIDialog from "@/components/meal-plan/MealPlanAIDialog";

const MealPlan = () => {
  const { t } = useLanguage();
  const mealPlanState = useMealPlanPage();

  if (mealPlanState.isLoading) {
    return <MealPlanLoadingState />;
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <UtensilsCrossed className="h-8 w-8 text-fitness-primary" />
                {t('mealPlan.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {mealPlanState.currentDate} • {mealPlanState.currentDay}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mealPlanState.currentWeekPlan && (
                <Button
                  onClick={mealPlanState.handleRegeneratePlan}
                  disabled={mealPlanState.isShuffling}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  {mealPlanState.isShuffling ? t('mealPlan.shuffling') : t('mealPlan.shuffle')}
                </Button>
              )}
              
              <Button
                onClick={() => mealPlanState.setShowAIDialog(true)}
                disabled={mealPlanState.isGenerating}
                className="flex items-center gap-2 bg-fitness-gradient text-white"
              >
                <Sparkles className="h-4 w-4" />
                {mealPlanState.isGenerating ? t('mealPlan.generating') : t('mealPlan.generateAI')}
              </Button>
            </div>
          </div>

          {/* Week Navigation */}
          <MealPlanWeekNavigation
            currentWeekOffset={mealPlanState.currentWeekOffset}
            onPreviousWeek={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset - 1)}
            onNextWeek={() => mealPlanState.setCurrentWeekOffset(mealPlanState.currentWeekOffset + 1)}
            onCurrentWeek={() => mealPlanState.setCurrentWeekOffset(0)}
            weekStartDate={mealPlanState.weekStartDate}
          />

          {/* Day Selector */}
          <MealPlanDaySelector
            selectedDay={mealPlanState.selectedDayNumber}
            onDaySelect={mealPlanState.setSelectedDayNumber}
            weekStartDate={mealPlanState.weekStartDate}
          />

          {mealPlanState.currentWeekPlan ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-1 space-y-4">
                <MealPlanStatsCard
                  totalCalories={mealPlanState.totalCalories}
                  totalProtein={mealPlanState.totalProtein}
                  targetDayCalories={mealPlanState.targetDayCalories}
                  selectedDay={mealPlanState.selectedDayNumber}
                />

                {/* Weekly Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('mealPlan.weeklyOverview')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>{t('mealPlan.totalCalories')}</span>
                      <span className="font-medium">{mealPlanState.currentWeekPlan.weeklyPlan.total_calories || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('mealPlan.totalProtein')}</span>
                      <span className="font-medium">{mealPlanState.currentWeekPlan.weeklyPlan.total_protein || 0}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('mealPlan.totalMeals')}</span>
                      <span className="font-medium">{mealPlanState.currentWeekPlan.dailyMeals?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <MealPlanDayContent
                  selectedDay={mealPlanState.selectedDayNumber}
                  todaysMeals={mealPlanState.todaysMeals}
                  onMealClick={mealPlanState.handleShowRecipe}
                  onRecipeClick={mealPlanState.handleShowRecipe}
                  onExchangeClick={mealPlanState.handleExchangeMeal}
                  weekStartDate={mealPlanState.weekStartDate}
                />
              </div>
            </div>
          ) : (
            <MealPlanEmptyState onGenerateClick={() => mealPlanState.setShowAIDialog(true)} />
          )}

          {/* Dialogs */}
          <MealPlanRecipeDialog
            open={mealPlanState.showRecipeDialog}
            onOpenChange={mealPlanState.setShowRecipeDialog}
            meal={mealPlanState.selectedMeal}
            onRecipeGenerated={mealPlanState.handleRecipeGenerated}
          />

          <MealPlanExchangeDialog
            open={mealPlanState.showExchangeDialog}
            onOpenChange={mealPlanState.setShowExchangeDialog}
            meal={mealPlanState.selectedMeal}
            mealIndex={mealPlanState.selectedMealIndex}
          />

          <MealPlanAIDialog
            open={mealPlanState.showAIDialog}
            onOpenChange={mealPlanState.setShowAIDialog}
            preferences={mealPlanState.aiPreferences}
            onPreferencesChange={mealPlanState.setAiPreferences}
            onGenerate={mealPlanState.handleGenerateAIPlan}
            isGenerating={mealPlanState.isGenerating}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MealPlan;
