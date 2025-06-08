
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface MealCalorieBreakdownProps {
  totalCalories: number;
  targetCalories: number;
  breakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}

export const MealCalorieBreakdown = ({
  totalCalories,
  targetCalories,
  breakdown
}: MealCalorieBreakdownProps) => {
  const { t, isRTL } = useI18n();

  const progress = targetCalories > 0 ? (totalCalories / targetCalories) * 100 : 0;
  const remaining = Math.max(0, targetCalories - totalCalories);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Flame className="w-5 h-5 text-orange-500" />
          {t('mealPlan:calorieBreakdown') || 'Calorie Breakdown'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium">
              {t('mealPlan:dailyProgress') || 'Daily Progress'}
            </span>
            <span className="text-sm text-gray-600">
              {totalCalories} / {targetCalories} {t('common:calories') || 'cal'}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-center">
            <span className="text-lg font-bold text-orange-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-yellow-700">{breakdown.breakfast}</div>
            <div className="text-xs text-yellow-600">{t('mealPlan:breakfast') || 'Breakfast'}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-700">{breakdown.lunch}</div>
            <div className="text-xs text-green-600">{t('mealPlan:lunch') || 'Lunch'}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-700">{breakdown.dinner}</div>
            <div className="text-xs text-blue-600">{t('mealPlan:dinner') || 'Dinner'}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-700">{breakdown.snacks}</div>
            <div className="text-xs text-purple-600">{t('mealPlan:snacks') || 'Snacks'}</div>
          </div>
        </div>

        {remaining > 0 && (
          <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              {remaining} {t('common:calories') || 'calories'} {t('mealPlan:remaining') || 'remaining'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealCalorieBreakdown;
