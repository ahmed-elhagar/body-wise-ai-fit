
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { DailyMeal } from '../../types';

interface CompactMealCardProps {
  meal: DailyMeal;
  index: number;
  mealType: string;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
}

const CompactMealCard = ({
  meal,
  index,
  mealType,
  onShowRecipe,
  onExchangeMeal
}: CompactMealCardProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{meal.name}</h4>
          <div className={`flex items-center gap-3 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {meal.calories} {t('common.cal')}
            </Badge>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{meal.prep_time + meal.cook_time} {t('common.min')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex gap-1 ml-2 ${isRTL ? 'flex-row-reverse mr-2 ml-0' : ''}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onShowRecipe(meal)}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onExchangeMeal(meal, index)}
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompactMealCard;
