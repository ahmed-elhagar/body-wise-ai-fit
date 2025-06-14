
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from 'date-fns';
import { useI18n } from "@/hooks/useI18n";
import { Utensils, Clock, Flame } from 'lucide-react';
import type { DailyMeal, MealPlanFetchResult } from '../types';

interface WeeklyMealPlanViewProps {
  weeklyPlan: MealPlanFetchResult;
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
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  const getMealsForDay = (dayNumber: number) => {
    return weeklyPlan.dailyMeals.filter(meal => meal.day_number === dayNumber);
  };

  const getDayCalories = (dayNumber: number) => {
    const dayMeals = getMealsForDay(dayNumber);
    return dayMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const getDayName = (dayNumber: number) => {
    const date = addDays(weekStartDate, dayNumber - 1);
    return format(date, 'EEE');
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack':
      case 'snack1':
      case 'snack2': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-4">
      {/* Weekly Summary */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-sm">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{String(tMealPlan('weeklyOverview'))}</h2>
            <p className="text-sm text-gray-600">
              {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'MMM d, yyyy')}
            </p>
          </div>
          <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
            <div className="text-2xl font-bold text-purple-600">
              {weeklyPlan.weeklyPlan.total_calories}
            </div>
            <div className="text-xs text-gray-500">{String(tMealPlan('weeklyCalories'))}</div>
          </div>
        </div>
      </Card>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map(dayNumber => {
          const dayMeals = getMealsForDay(dayNumber);
          const dayCalories = getDayCalories(dayNumber);
          const dayName = getDayName(dayNumber);

          return (
            <Card key={dayNumber} className="p-4 hover:shadow-md transition-shadow">
              {/* Day Header */}
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <h3 className="font-semibold text-gray-800">{dayName}</h3>
                  <p className="text-xs text-gray-500">Day {dayNumber}</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Flame className="w-3 h-3 mr-1" />
                  {dayCalories}
                </Badge>
              </div>

              {/* Meals */}
              <div className="space-y-2">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal, index) => (
                    <div
                      key={`${meal.id}-${index}`}
                      className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onViewMeal(meal)}
                    >
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm">
                          {getMealTypeIcon(meal.meal_type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {meal.name}
                          </p>
                          <div className={`flex items-center gap-2 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {meal.calories}
                            </span>
                            {(meal.prep_time || meal.cook_time) && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {(meal.prep_time || 0) + (meal.cook_time || 0)}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Utensils className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">{String(tMealPlan('noMealsPlanned'))}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
