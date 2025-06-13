
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, ArrowLeftRight } from 'lucide-react';
import type { DailyMeal } from '../types';

interface MealListCardProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const MealListCard = ({ meal, onViewMeal, onExchangeMeal }: MealListCardProps) => {
  const mealTypeColors = {
    breakfast: 'bg-orange-100 border-orange-300 text-orange-700',
    lunch: 'bg-green-100 border-green-300 text-green-700',
    dinner: 'bg-blue-100 border-blue-300 text-blue-700',
    snack1: 'bg-purple-100 border-purple-300 text-purple-700',
    snack2: 'bg-pink-100 border-pink-300 text-pink-700',
    snack: 'bg-purple-100 border-purple-300 text-purple-700'
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-fitness-primary-500">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge 
                className={`${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-100 border-gray-300 text-gray-700'} font-medium`}
              >
                {meal.meal_type}
              </Badge>
              <h3 className="font-semibold text-lg text-gray-800">{meal.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span className="text-gray-600">{meal.calories} cal</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">{meal.protein}g protein</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-600">{meal.carbs}g carbs</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-gray-600">{meal.fat}g fat</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              onClick={() => onViewMeal(meal)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
            >
              <ChefHat className="w-4 h-4 mr-1" />
              Recipe
            </Button>
            <Button
              size="sm"
              onClick={() => onExchangeMeal(meal)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
            >
              <ArrowLeftRight className="w-4 h-4 mr-1" />
              Exchange
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
