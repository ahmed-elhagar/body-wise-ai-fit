
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeftRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { DailyMeal } from "@/features/meal-plan/types";

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
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-all duration-200 border border-gray-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
              {meal.name}
            </h4>
            <div className="text-xs text-gray-600">
              {meal.calories} {String(tMealPlan('cal'))} • {meal.protein}g {String(tMealPlan('protein'))}
            </div>
          </div>
          
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs border-teal-500 text-teal-700 hover:bg-teal-500 hover:text-white transition-colors"
              onClick={() => onExchangeMeal(meal, index)}
            >
              <ArrowLeftRight className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
              onClick={() => onShowRecipe(meal)}
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactMealCard;
