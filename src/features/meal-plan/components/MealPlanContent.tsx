
import React from 'react';
import { DayOverview } from './DayOverview';
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
    return (
      <DayOverview
        selectedDayNumber={selectedDayNumber}
        dailyMeals={dailyMeals || []}
        totalCalories={totalCalories || 0}
        totalProtein={totalProtein || 0}
        targetDayCalories={targetDayCalories || 2000}
        onViewMeal={onViewMeal}
        onExchangeMeal={onExchangeMeal}
        onAddSnack={onAddSnack}
        weekStartDate={weekStartDate}
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
