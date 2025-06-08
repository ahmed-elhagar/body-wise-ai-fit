
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChefHat, ArrowLeftRight, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t, isRTL } = useLanguage();

  const getDayName = (dayNumber: number) => {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber - 1] || 'Day';
  };

  const getDayMeals = (dayNumber: number) => {
    return weeklyPlan?.dailyMeals?.filter(
      (meal: DailyMeal) => meal.day_number === dayNumber
    ) || [];
  };

  const getDayCalories = (dayNumber: number) => {
    const meals = getDayMeals(dayNumber);
    return meals.reduce((sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 0);
  };

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    return {
      number: dayNumber,
      name: getDayName(dayNumber),
      date,
      meals: getDayMeals(dayNumber),
      calories: getDayCalories(dayNumber)
    };
  });

  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Calendar className="w-6 h-6 text-violet-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t('mealPlan.weeklyOverview') || 'Weekly Overview'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {weekDays.map((day) => (
          <Card key={day.number} className="bg-white border border-gray-200 hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {day.name}
                </CardTitle>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {day.calories} cal
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(day.date, 'MMM d')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {day.meals.length > 0 ? (
                day.meals.map((meal: DailyMeal) => (
                  <div key={meal.id} className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <Badge 
                          variant="outline" 
                          className="mb-1 bg-white text-gray-700 border border-gray-300 text-xs"
                        >
                          {meal.meal_type}
                        </Badge>
                        <h5 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {meal.name}
                        </h5>
                      </div>
                      <span className="text-xs font-medium text-blue-600">
                        {meal.calories || 0} cal
                      </span>
                    </div>
                    
                    <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs hover:bg-blue-50"
                        onClick={() => onViewMeal(meal)}
                      >
                        <ChefHat className="w-3 h-3 mr-1" />
                        {t('mealPlan.recipe') || 'Recipe'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs hover:bg-orange-50"
                        onClick={() => onExchangeMeal(meal)}
                      >
                        <ArrowLeftRight className="w-3 h-3 mr-1" />
                        {t('mealPlan.exchange') || 'Exchange'}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">
                    {t('mealPlan.noMealsPlanned') || 'No meals planned'}
                  </p>
                </div>
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t('mealPlan.addSnack') || 'Add Snack'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
