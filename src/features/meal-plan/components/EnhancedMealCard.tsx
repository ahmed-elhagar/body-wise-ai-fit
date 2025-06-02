
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowLeftRight } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import type { DailyMeal } from '../types';

interface EnhancedMealCardProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const EnhancedMealCard = ({ meal, onViewMeal, onExchangeMeal }: EnhancedMealCardProps) => {
  const { mealTypes, cal, recipe, exchange } = useMealPlanTranslations();

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'bg-yellow-100 border-yellow-200';
      case 'lunch':
        return 'bg-blue-100 border-blue-200';
      case 'dinner':
        return 'bg-purple-100 border-purple-200';
      case 'snack1':
      case 'snack2':
      case 'snack':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getMealTypeLabel = (mealType: string) => {
    const typeMap: Record<string, string> = {
      breakfast: mealTypes.breakfast,
      lunch: mealTypes.lunch,
      dinner: mealTypes.dinner,
      snack1: mealTypes.snack1,
      snack2: mealTypes.snack2,
      snack: mealTypes.snack
    };
    return typeMap[mealType.toLowerCase()] || mealType;
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${getMealTypeColor(meal.meal_type)}`}>
      <CardContent className="p-0">
        {/* Meal Image */}
        <div className="h-32 bg-white rounded-t-lg overflow-hidden relative">
          {meal.image_url ? (
            <img 
              src={meal.image_url} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          )}
          
          {/* Meal Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 text-xs font-medium capitalize"
          >
            {getMealTypeLabel(meal.meal_type)}
          </Badge>
        </div>

        {/* Meal Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {meal.name}
          </h3>
          
          <div className="text-xs text-gray-600">
            {meal.calories} {cal}, {meal.protein}g
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 border-2 border-teal-500 text-teal-700 hover:bg-teal-500 hover:text-white transition-colors"
              onClick={() => onExchangeMeal(meal)}
            >
              {exchange}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="w-full text-xs h-6 text-gray-600 hover:text-gray-900"
              onClick={() => onViewMeal(meal)}
            >
              <Eye className="w-3 h-3 mr-1" />
              {recipe}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
