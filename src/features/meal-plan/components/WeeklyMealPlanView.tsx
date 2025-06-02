
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeftRight, Utensils } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t, isRTL } = useLanguage();

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

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'lunch': return 'bg-green-100 text-green-700 border-green-200';
      case 'dinner': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-3">
      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
          const dayMeals = getMealsByDay(dayNumber);
          const totalCalories = dayMeals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
          
          return (
            <Card key={dayNumber} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {getDayName(dayNumber)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {getDayDate(dayNumber)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {totalCalories} cal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal: any) => (
                    <div key={meal.id} className="bg-gray-50 rounded-lg p-2">
                      <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getMealTypeColor(meal.meal_type)}`}
                        >
                          {meal.meal_type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {meal.calories} cal
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-gray-800 mb-2 line-clamp-2">
                        {meal.name}
                      </h4>
                      <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewMeal(meal)}
                          className="h-6 px-2 text-xs"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onExchangeMeal(meal)}
                          className="h-6 px-2 text-xs"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      {t('mealPlan.noMealsPlanned') || 'No meals planned'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
