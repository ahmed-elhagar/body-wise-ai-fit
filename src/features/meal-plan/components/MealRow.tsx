
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeftRight, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '../types';

interface MealRowProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const MealRow = ({ meal, onViewMeal, onExchangeMeal }: MealRowProps) => {
  const { isRTL } = useLanguage();

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'lunch': return 'bg-green-100 text-green-700 border-green-200';
      case 'dinner': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍎';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-all duration-200">
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Meal Type Icon */}
        <div className="text-lg">
          {getMealTypeIcon(meal.meal_type)}
        </div>

        {/* Meal Info */}
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge 
              variant="outline" 
              className={`text-xs ${getMealTypeColor(meal.meal_type)}`}
            >
              {meal.meal_type}
            </Badge>
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {meal.name}
            </h3>
          </div>
          
          <div className={`flex items-center gap-3 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              {meal.calories} cal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {meal.protein}g protein
            </span>
            {meal.prep_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {(meal.prep_time || 0) + (meal.cook_time || 0)}min
              </span>
            )}
            {meal.servings && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {meal.servings}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewMeal(meal)}
            className="h-8 px-2 text-xs hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onExchangeMeal(meal)}
            className="h-8 px-2 text-xs hover:bg-green-50 hover:text-green-600"
          >
            <ArrowLeftRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
