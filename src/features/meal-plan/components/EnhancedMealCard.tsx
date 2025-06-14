
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowLeftRight } from "lucide-react";
import { useI18n } from '@/hooks/useI18n';
import type { DailyMeal } from '../types';

interface EnhancedMealCardProps {
  meal: DailyMeal;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

export const EnhancedMealCard = ({ meal, onViewMeal, onExchangeMeal }: EnhancedMealCardProps) => {
  const { t } = useI18n();

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
    const mealTypeKey = mealType.toLowerCase();
    return t(`mealPlan:mealTypes.${mealTypeKey}`, { defaultValue: mealType });
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-200 ${getMealTypeColor(meal.meal_type)}`}>
      <CardContent className="p-0">
        {/* Compact Meal Image */}
        <div className="h-24 bg-white rounded-t-lg overflow-hidden relative">
          {meal.image_url ? (
            <img 
              src={meal.image_url} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-lg">🍽️</span>
              </div>
            </div>
          )}
          
          {/* Compact Meal Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-1 left-1 text-xs font-medium capitalize px-1 py-0"
          >
            {getMealTypeLabel(meal.meal_type)}
          </Badge>
        </div>

        {/* Compact Meal Info */}
        <div className="p-2 space-y-2">
          <h3 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2">
            {meal.name}
          </h3>
          
          <div className="text-xs text-gray-600">
            {meal.calories} {t('mealPlan:cal')} • {meal.protein}g
          </div>

          {/* Compact Action Buttons */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-6 border border-teal-500 text-teal-700 hover:bg-teal-500 hover:text-white transition-colors"
              onClick={() => onExchangeMeal(meal)}
            >
              <ArrowLeftRight className="w-3 h-3 mr-1" />
              {t('mealPlan:exchange')}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-6 text-gray-600 hover:text-gray-900 px-2"
              onClick={() => onViewMeal(meal)}
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
