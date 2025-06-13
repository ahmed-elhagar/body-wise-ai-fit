
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DayMealCard } from './DayMealCard';
import type { DailyMeal } from '../types';

interface WeeklyMealPlanViewProps {
  weeklyPlan: any;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  weekStartDate: Date;
}

export const WeeklyMealPlanView = ({ 
  weeklyPlan, 
  onViewMeal, 
  onExchangeMeal,
  weekStartDate 
}: WeeklyMealPlanViewProps) => {
  const { t } = useLanguage();

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('saturday') || 'Saturday',
      t('sunday') || 'Sunday', 
      t('monday') || 'Monday',
      t('tuesday') || 'Tuesday',
      t('wednesday') || 'Wednesday',
      t('thursday') || 'Thursday',
      t('friday') || 'Friday'
    ];
    return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
  };

  const getDayDate = (dayNumber: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toLocaleDateString();
  };

  const getMealsByDay = (dayNumber: number) => {
    return weeklyPlan?.dailyMeals?.filter((meal: any) => meal.day_number === dayNumber) || [];
  };

  return (
    <div className="space-y-4">
      {/* Days Grid - 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
          const dayMeals = getMealsByDay(dayNumber);
          const totalCalories = dayMeals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
          
          return (
            <DayMealCard
              key={dayNumber}
              dayNumber={dayNumber}
              dayName={getDayName(dayNumber)}
              dayDate={getDayDate(dayNumber)}
              dayMeals={dayMeals}
              totalCalories={totalCalories}
              onViewMeal={onViewMeal}
              onExchangeMeal={onExchangeMeal}
            />
          );
        })}
      </div>
    </div>
  );
};
