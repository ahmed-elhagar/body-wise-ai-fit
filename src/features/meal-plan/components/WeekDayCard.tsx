
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '../types';

interface WeekDayCardProps {
  dayNumber: number;
  meals: DailyMeal[];
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const WeekDayCard = ({
  dayNumber,
  meals,
  onViewMeal,
  onExchangeMeal
}: WeekDayCardProps) => {
  const { t } = useLanguage();
  
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-center">
          {t(dayNames[dayNumber - 1])}
        </CardTitle>
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {totalCalories} cal
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {meals.map(meal => (
          <div
            key={meal.id}
            className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onViewMeal(meal)}
          >
            <div className="text-xs font-medium text-gray-700 capitalize">
              {t(meal.meal_type)}
            </div>
            <div className="text-sm text-gray-900 line-clamp-2">
              {meal.name}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
