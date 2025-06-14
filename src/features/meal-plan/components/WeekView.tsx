
import React from 'react';
import { WeekDayCard } from './WeekDayCard';
import type { MealPlanFetchResult, DailyMeal } from '../types';

interface WeekViewProps {
  weeklyPlan: MealPlanFetchResult;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  weekStartDate: Date;
}

export const WeekView = ({
  weeklyPlan,
  onViewMeal,
  onExchangeMeal,
  weekStartDate
}: WeekViewProps) => {
  const groupedMeals = React.useMemo(() => {
    const grouped: { [key: number]: DailyMeal[] } = {};
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (!grouped[meal.day_number]) {
        grouped[meal.day_number] = [];
      }
      grouped[meal.day_number].push(meal);
    });
    
    return grouped;
  }, [weeklyPlan.dailyMeals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map(dayNumber => (
        <WeekDayCard
          key={dayNumber}
          dayNumber={dayNumber}
          meals={groupedMeals[dayNumber] || []}
          onViewMeal={onViewMeal}
          onExchangeMeal={onExchangeMeal}
        />
      ))}
    </div>
  );
};
