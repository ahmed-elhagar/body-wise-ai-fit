
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeftRight, Clock, Users } from 'lucide-react';
import type { DailyMeal } from '../types';

interface MealRowProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const MealRow = ({ meal, onViewMeal, onExchangeMeal }: MealRowProps) => {
  const totalTime = (meal.prep_time || 0) + (meal.cook_time || 0);
  
  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
            {meal.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{totalTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{meal.servings || 1}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {meal.calories} cal
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-1 ml-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewMeal(meal)}
            className="h-7 px-2 text-xs hover:bg-blue-50"
          >
            <Eye className="w-3 h-3 mr-1" />
            Recipe
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExchangeMeal(meal)}
            className="h-7 px-2 text-xs hover:bg-green-50"
          >
            <ArrowLeftRight className="w-3 h-3 mr-1" />
            Exchange
          </Button>
        </div>
      </div>
      
      {/* Nutrition breakdown */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center bg-white rounded p-1">
          <span className="font-medium text-green-600">{meal.protein}g</span>
          <div className="text-gray-500">protein</div>
        </div>
        <div className="text-center bg-white rounded p-1">
          <span className="font-medium text-orange-600">{meal.carbs}g</span>
          <div className="text-gray-500">carbs</div>
        </div>
        <div className="text-center bg-white rounded p-1">
          <span className="font-medium text-purple-600">{meal.fat}g</span>
          <div className="text-gray-500">fat</div>
        </div>
      </div>
    </div>
  );
};
