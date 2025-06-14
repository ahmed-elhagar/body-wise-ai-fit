
import React from 'react';
import { DayView } from './DayView';
import type { DailyMeal } from '../types';

interface DayOverviewProps {
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  weekStartDate: Date;
}

const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayOverviewProps) => {
  return (
    <DayView
      selectedDayNumber={selectedDayNumber}
      dailyMeals={dailyMeals}
      totalCalories={totalCalories}
      totalProtein={totalProtein}
      targetDayCalories={targetDayCalories}
      onViewMeal={onViewMeal}
      onExchangeMeal={onExchangeMeal}
      onAddSnack={onAddSnack}
      weekStartDate={weekStartDate}
    />
  );
};

export default DayOverview;
