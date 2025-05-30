
import React, { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Shuffle, Sparkles, Calendar, TrendingUp, Target } from "lucide-react";
import MealPlanWeekNavigation from "./MealPlanWeekNavigation";
import MealPlanDaySelector from "./MealPlanDaySelector";
import MealPlanLoadingState from "./MealPlanLoadingState";
import MealPlanEmptyState from "./MealPlanEmptyState";
import MealPlanStatsCard from "./MealPlanStatsCard";
import MealPlanDayContent from "./MealPlanDayContent";
import MealPlanRecipeDialog from "./MealPlanRecipeDialog";
import MealPlanExchangeDialog from "./MealPlanExchangeDialog";
import MealPlanAIDialog from "./MealPlanAIDialog";

interface MealPlanPageContentProps {
  currentDate: string;
  currentDay: string;
  onShowAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  dietType?: string;
  totalWeeklyCalories?: number;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  viewMode: 'daily' | 'weekly';
  setViewMode: (mode: 'daily' | 'weekly') => void;
  currentWeekPlan: any;
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  handleShowRecipe: (meal: any) => void;
  handleExchangeMeal: (meal: any, index: number) => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (preferences: any) => void;
  handleGenerateAIPlan: () => void;
  showAddSnackDialog: boolean;
  setShowAddSnackDialog: (show: boolean) => void;
  refetch: () => void;
  showShoppingListDialog: boolean;
  setShowShoppingListDialog: (show: boolean) => void;
  convertMealsToShoppingItems: (meals: any[]) => any[];
  showRecipeDialog: boolean;
  setShowRecipeDialog: (show: boolean) => void;
  selectedMeal: any;
  showExchangeDialog: boolean;
  setShowExchangeDialog: (show: boolean) => void;
  selectedMealIndex: number;
  handleRecipeGenerated: () => void;
}

const MealPlanPageContent = (props: MealPlanPageContentProps) => {
  if (props.isGenerating) {
    return <MealPlanLoadingState />;
  }

  return (
    <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Enhanced Header - More compact */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl" />
          
          <Card className="relative p-4 md:p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="absolute top-2 right-2 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Meal Plan
                      </h1>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        AI-Powered Personalized Nutrition
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1 text-xs md:text-sm font-semibold shadow-md">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {props.currentDate} • {props.currentDay}
                    </Badge>
                    {props.dietType && (
                      <Badge variant="outline" className="bg-white/80 border-gray-200 text-gray-700 px-3 py-1 text-xs md:text-sm font-medium">
                        {props.dietType}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  {props.currentWeekPlan && (
                    <Button
                      onClick={props.onRegeneratePlan}
                      disabled={props.isShuffling}
                      variant="outline"
                      size="sm"
                      className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      {props.isShuffling ? 'Shuffling...' : 'Shuffle Plan'}
                    </Button>
                  )}
                  
                  <Button
                    onClick={props.onShowAIDialog}
                    disabled={props.isGenerating}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {props.isGenerating ? 'Generating...' : 'Generate AI Plan'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Controls - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MealPlanWeekNavigation
            currentWeekOffset={props.currentWeekOffset}
            onPreviousWeek={() => props.setCurrentWeekOffset(props.currentWeekOffset - 1)}
            onNextWeek={() => props.setCurrentWeekOffset(props.currentWeekOffset + 1)}
            onCurrentWeek={() => props.setCurrentWeekOffset(0)}
            weekStartDate={props.weekStartDate}
          />

          {/* View Mode Toggle - New */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">View Mode</span>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => props.setViewMode('daily')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    props.viewMode === 'daily'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => props.setViewMode('weekly')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    props.viewMode === 'weekly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </Card>
        </div>

        <MealPlanDaySelector
          selectedDay={props.selectedDayNumber}
          onDaySelect={props.setSelectedDayNumber}
          weekStartDate={props.weekStartDate}
        />

        {props.currentWeekPlan ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Enhanced Weekly Overview - Moved to better position */}
            <div className="xl:col-span-1 space-y-4">
              <MealPlanStatsCard
                totalCalories={props.totalCalories}
                totalProtein={props.totalProtein}
                targetDayCalories={2000}
                selectedDay={props.selectedDayNumber}
              />

              {/* Weekly Overview Card - Enhanced */}
              <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Total Calories</span>
                      </div>
                      <span className="font-bold text-blue-600">{props.totalWeeklyCalories || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Total Protein</span>
                      </div>
                      <span className="font-bold text-green-600">{props.currentWeekPlan.weeklyPlan?.total_protein || 0}g</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Total Meals</span>
                      </div>
                      <span className="font-bold text-purple-600">{props.currentWeekPlan.dailyMeals?.length || 0}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Daily Average</span>
                      <Target className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round((props.totalWeeklyCalories || 0) / 7)}
                      </div>
                      <div className="text-xs text-gray-500">calories/day</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              <MealPlanDayContent
                selectedDay={props.selectedDayNumber}
                todaysMeals={props.todaysMeals}
                onMealClick={props.handleShowRecipe}
                onRecipeClick={props.handleShowRecipe}
                onExchangeClick={props.handleExchangeMeal}
                weekStartDate={props.weekStartDate}
              />
            </div>
          </div>
        ) : (
          <MealPlanEmptyState onGenerateClick={props.onShowAIDialog} />
        )}

        {/* Dialogs */}
        <MealPlanRecipeDialog
          open={props.showRecipeDialog}
          onOpenChange={props.setShowRecipeDialog}
          meal={props.selectedMeal}
          onRecipeGenerated={props.handleRecipeGenerated}
        />

        <MealPlanExchangeDialog
          open={props.showExchangeDialog}
          onOpenChange={props.setShowExchangeDialog}
          meal={props.selectedMeal}
          mealIndex={props.selectedMealIndex}
        />

        <MealPlanAIDialog
          open={props.showAIDialog}
          onOpenChange={props.setShowAIDialog}
          preferences={props.aiPreferences}
          onPreferencesChange={props.setAiPreferences}
          onGenerate={props.handleGenerateAIPlan}
          isGenerating={props.isGenerating}
        />
      </div>
    </div>
  );
};

export default MealPlanPageContent;
