
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeftRight, Utensils } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '../types';

interface MealItemProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  isRTL: boolean;
}

const MealItem = ({ meal, onViewMeal, onExchangeMeal, isRTL }: MealItemProps) => {
  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'lunch': return 'bg-green-100 text-green-700 border-green-200';
      case 'dinner': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border hover:bg-gray-100 transition-colors">
      <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Badge 
          variant="outline" 
          className={`text-xs font-medium ${getMealTypeColor(meal.meal_type)}`}
        >
          {meal.meal_type}
        </Badge>
        <span className="text-xs text-gray-600 font-medium">
          {meal.calories} cal
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2">
        {meal.name}
      </h4>
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewMeal(meal)}
          className="h-7 px-3 text-xs hover:bg-blue-50 hover:border-blue-300"
        >
          <Eye className="w-3 h-3 mr-1" />
          Recipe
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onExchangeMeal(meal)}
          className="h-7 px-3 text-xs hover:bg-green-50 hover:border-green-300"
        >
          <ArrowLeftRight className="w-3 h-3 mr-1" />
          Exchange
        </Button>
      </div>
    </div>
  );
};

interface DayMealCardProps {
  dayNumber: number;
  dayName: string;
  dayDate: string;
  dayMeals: DailyMeal[];
  totalCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const DayMealCard = ({
  dayNumber,
  dayName,
  dayDate,
  dayMeals,
  totalCalories,
  onViewMeal,
  onExchangeMeal
}: DayMealCardProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="font-bold text-gray-900 text-lg">
              {dayName}
            </h3>
            <p className="text-sm text-gray-500">
              {dayDate}
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            {totalCalories} cal
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {dayMeals.length > 0 ? (
          dayMeals.map((meal: DailyMeal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              onViewMeal={onViewMeal}
              onExchangeMeal={onExchangeMeal}
              isRTL={isRTL}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {t('mealPlan.noMealsPlanned') || 'No meals planned'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
