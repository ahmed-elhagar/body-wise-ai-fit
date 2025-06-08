
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeftRight, Clock, Users } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { Meal } from '@/types/meal';

interface MealRowProps {
  meal: Meal;
  mealIndex: number;
  dayNumber: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

export const MealRow = ({ 
  meal, 
  mealIndex, 
  dayNumber, 
  onShowRecipe, 
  onExchangeMeal 
}: MealRowProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`group bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate mb-1">
            {meal.name}
          </h4>
          <div className={`flex items-center gap-3 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="secondary" className="text-xs">
              {meal.calories} {t('mealPlan.cal')}
            </Badge>
            {meal.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{meal.prepTime} min</span>
              </div>
            )}
            {meal.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{meal.servings} servings</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowRecipe(meal)}
            className="h-8 px-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExchangeMeal(meal, dayNumber, mealIndex)}
            className="h-8 px-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
