
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Eye, RefreshCw, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '../types';

interface MealCardProps {
  meal: DailyMeal;
  onViewRecipe: (meal: DailyMeal) => void;
  onExchange: (meal: DailyMeal) => void;
}

export const MealCard = ({ meal, onViewRecipe, onExchange }: MealCardProps) => {
  const { t } = useLanguage();

  const mealTypeColors = {
    breakfast: 'bg-orange-100 text-orange-800',
    lunch: 'bg-green-100 text-green-800',
    dinner: 'bg-blue-100 text-blue-800',
    snack: 'bg-purple-100 text-purple-800',
    snack1: 'bg-purple-100 text-purple-800',
    snack2: 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Badge className={mealTypeColors[meal.meal_type] || 'bg-gray-100 text-gray-800'}>
              {t(meal.meal_type)}
            </Badge>
            <h3 className="font-semibold text-lg mt-2 text-gray-900">
              {meal.name}
            </h3>
          </div>
          <ChefHat className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="font-medium text-orange-600">{meal.calories}</span>
            <span className="ml-1">{t('cal')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium text-green-600">{meal.protein}g</span>
            <span className="ml-1">{t('protein')}</span>
          </div>
          {meal.prep_time && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>{meal.prep_time}min</span>
            </div>
          )}
          {meal.servings && (
            <div className="flex items-center text-gray-600">
              <Users className="w-3 h-3 mr-1" />
              <span>{meal.servings} servings</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onViewRecipe(meal)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t('Recipe')}
          </Button>
          <Button
            onClick={() => onExchange(meal)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('Exchange')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
