
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailySummaryCardProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  selectedDay: number;
}

export const DailySummaryCard = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  selectedDay
}: DailySummaryCardProps) => {
  const { t } = useLanguage();
  
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t('Daily Calories')}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-violet-900">
                {totalCalories}
              </span>
              <span className="text-sm text-gray-600">
                / {targetDayCalories}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-2" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t('Protein')}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-violet-900">
                {Math.round(totalProtein)}g
              </span>
              <span className="text-sm text-gray-600">
                / {proteinTarget}g
              </span>
            </div>
            <Progress value={proteinProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
