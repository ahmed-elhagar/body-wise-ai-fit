
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MealCard } from './MealCard';
import { DailySummaryCard } from './DailySummaryCard';
import { AddMealCard } from './AddMealCard';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '../types';

interface DayViewProps {
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

export const DayView = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <DailySummaryCard
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        targetDayCalories={targetDayCalories}
        selectedDay={selectedDayNumber}
      />
      
      <div className="grid gap-4">
        {dailyMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onViewRecipe={onViewMeal}
            onExchange={onExchangeMeal}
          />
        ))}
        
        <AddMealCard onAddSnack={onAddSnack} />
      </div>
    </div>
  );
};
