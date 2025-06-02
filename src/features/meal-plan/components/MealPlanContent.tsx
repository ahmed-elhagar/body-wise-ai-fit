
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import DayOverview from "@/components/meal-plan/DayOverview";
import type { MealPlanFetchResult, DailyMeal } from '../types';
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  currentWeekPlan: MealPlanFetchResult | null;
  selectedDayNumber: number;
  dailyMeals: DailyMeal[] | null;
  totalCalories: number | null;
  totalProtein: number | null;
  targetDayCalories: number;
  weekStartDate: Date;
  currentWeekOffset: number;
  isGenerating: boolean;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  onGenerateAI: () => void;
  setCurrentWeekOffset: (offset: number) => void;
  setSelectedDayNumber: (day: number) => void;
}

export const MealPlanContent = ({
  viewMode,
  currentWeekPlan,
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  weekStartDate,
  currentWeekOffset,
  isGenerating,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  onGenerateAI,
  setCurrentWeekOffset,
  setSelectedDayNumber
}: MealPlanContentProps) => {
  const { noMealPlan, generateFirstPlan, aiPowered } = useMealPlanTranslations();

  // Show no meal plan state
  if (!currentWeekPlan?.weeklyPlan && !isGenerating) {
    return (
      <Card className="border-dashed border-2 border-fitness-primary-300 bg-gradient-to-br from-fitness-primary-50 to-white">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-fitness-primary-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-fitness-primary-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-fitness-primary-800">
            {noMealPlan}
          </h3>
          <p className="text-fitness-primary-600 mb-8 max-w-md mx-auto text-lg">
            {generateFirstPlan}
          </p>
          <Button 
            onClick={onGenerateAI}
            className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {aiPowered}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (isGenerating) {
    return (
      <Card className="bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-fitness-primary-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-fitness-primary-200 rounded mx-auto w-48"></div>
            <div className="h-4 bg-fitness-primary-200 rounded mx-auto w-64"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show daily view
  if (viewMode === 'daily') {
    return (
      <DayOverview
        selectedDayNumber={selectedDayNumber}
        dailyMeals={dailyMeals || []}
        totalCalories={totalCalories || 0}
        totalProtein={totalProtein || 0}
        targetDayCalories={targetDayCalories}
        onViewMeal={onViewMeal}
        onExchangeMeal={onExchangeMeal}
        onAddSnack={onAddSnack}
        weekStartDate={weekStartDate}
      />
    );
  }

  // Show weekly view (simplified for now)
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Weekly View</h3>
        <p className="text-gray-600">Weekly meal plan overview coming soon...</p>
      </CardContent>
    </Card>
  );
};
