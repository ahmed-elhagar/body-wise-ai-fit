
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface CompactDailyProgressProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  targetProtein?: number;
}

export const CompactDailyProgress = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  targetProtein = 150
}: CompactDailyProgressProps) => {
  const { t, isRTL } = useI18n();

  const caloriePercentage = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinPercentage = Math.min((totalProtein / targetProtein) * 100, 100);

  const getProgressColor = (percentage: number) => {
    if (percentage < 60) return 'bg-orange-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'rtl' : ''}`}>
        {/* Calories */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('mealPlan.calories') || 'Calories'}
            </span>
          </div>
          <div className="space-y-1">
            <div className={`flex justify-between text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{totalCalories}</span>
              <span>{targetDayCalories}</span>
            </div>
            <Progress 
              value={caloriePercentage} 
              className="h-2"
              style={{
                background: 'rgba(156, 163, 175, 0.2)',
              }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('mealPlan.protein') || 'Protein'}
            </span>
          </div>
          <div className="space-y-1">
            <div className={`flex justify-between text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{Math.round(totalProtein)}g</span>
              <span>{targetProtein}g</span>
            </div>
            <Progress 
              value={proteinPercentage} 
              className="h-2"
              style={{
                background: 'rgba(156, 163, 175, 0.2)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Summary text */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-center text-gray-600">
          {caloriePercentage >= 90 && proteinPercentage >= 90 ? (
            <span className="text-green-600 font-medium">
              {t('mealPlan.dailyGoalsAchieved') || '🎯 Daily goals achieved!'}
            </span>
          ) : (
            <span>
              {Math.round(targetDayCalories - totalCalories)} {t('mealPlan.caloriesRemaining') || 'kcal remaining'}
            </span>
          )}
        </p>
      </div>
    </Card>
  );
};
