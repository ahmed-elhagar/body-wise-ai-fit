
import React from 'react';
import DayOverview from './DayOverview';
import { WeeklyMealPlanView } from './WeeklyMealPlanView';
import { EmptyWeekState } from './EmptyWeekState';
import type { DailyMeal, MealPlanFetchResult } from '../types';

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  currentWeekPlan: MealPlanFetchResult | null;
  selectedDayNumber: number;
  dailyMeals: DailyMeal[] | null;
  totalCalories: number | null;
  totalProtein: number | null;
  targetDayCalories: number | null;
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
  if (!currentWeekPlan?.weeklyPlan) {
    return (
      <EmptyWeekState
        onGenerateAI={onGenerateAI}
        isGenerating={isGenerating}
      />
    );
  }

  if (viewMode === 'daily') {
    // Calculate the selected date based on weekStartDate and selectedDayNumber
    const selectedDate = new Date(weekStartDate);
    selectedDate.setDate(selectedDate.getDate() + (selectedDayNumber - 1));

    return (
      <DayOverview
        date={selectedDate}
        meals={dailyMeals || []}
        onShowRecipe={onViewMeal}
        onExchangeMeal={onExchangeMeal}
        targetCalories={targetDayCalories || 2000}
      />
    );
  }

  return (
    <WeeklyMealPlanView
      weeklyPlan={currentWeekPlan}
      onViewMeal={onViewMeal}
      onExchangeMeal={onExchangeMeal}
      weekStartDate={weekStartDate}
    />
  );
};
