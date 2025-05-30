
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Shuffle, Sparkles, Calendar } from "lucide-react";
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
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-blue-600" />
              Meal Plan
            </h1>
            <p className="text-gray-600 mt-1">
              {props.currentDate} • {props.currentDay}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {props.currentWeekPlan && (
              <Button
                onClick={props.onRegeneratePlan}
                disabled={props.isShuffling}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <Shuffle className="h-4 w-4" />
                <span className="text-gray-700">
                  {props.isShuffling ? 'Shuffling...' : 'Shuffle'}
                </span>
              </Button>
            )}
            
            <Button
              onClick={props.onShowAIDialog}
              disabled={props.isGenerating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-white">
                {props.isGenerating ? 'Generating...' : 'Generate AI Plan'}
              </span>
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <MealPlanWeekNavigation
          currentWeekOffset={props.currentWeekOffset}
          onPreviousWeek={() => props.setCurrentWeekOffset(props.currentWeekOffset - 1)}
          onNextWeek={() => props.setCurrentWeekOffset(props.currentWeekOffset + 1)}
          onCurrentWeek={() => props.setCurrentWeekOffset(0)}
          weekStartDate={props.weekStartDate}
        />

        {/* Day Selector */}
        <MealPlanDaySelector
          selectedDay={props.selectedDayNumber}
          onDaySelect={props.setSelectedDayNumber}
          weekStartDate={props.weekStartDate}
        />

        {props.currentWeekPlan ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-1 space-y-4">
              <MealPlanStatsCard
                totalCalories={props.totalCalories}
                totalProtein={props.totalProtein}
                targetDayCalories={2000}
                selectedDay={props.selectedDayNumber}
              />

              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Calories</span>
                    <span className="font-medium text-gray-900">{props.totalWeeklyCalories || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Protein</span>
                    <span className="font-medium text-gray-900">{props.currentWeekPlan.weeklyPlan?.total_protein || 0}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Meals</span>
                    <span className="font-medium text-gray-900">{props.currentWeekPlan.dailyMeals?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
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
