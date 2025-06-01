import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useI18n } from "@/hooks/useI18n";

interface StatsSidebarProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
}

const StatsSidebar = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  targetCalories
}: StatsSidebarProps) => {
  const { t, isRTL } = useI18n();

  const proteinPercentage = (totalProtein / (targetCalories / 4)) * 100;
  const carbsPercentage = (totalCarbs / (targetCalories / 4)) * 100;
  const fatPercentage = (totalFat / (targetCalories / 9)) * 100;

  const remainingCalories = targetCalories - totalCalories;
  const progressPercentage = Math.min((totalCalories / targetCalories) * 100, 100);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('mealPlan.dailyStats')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('mealPlan.calories')}</span>
            <span className="text-sm font-medium">
              {totalCalories} / {targetCalories}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('mealPlan.protein')}</span>
              <span className="text-sm font-medium">{totalProtein.toFixed(1)}g</span>
            </div>
            <Progress value={proteinPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('mealPlan.carbs')}</span>
              <span className="text-sm font-medium">{totalCarbs.toFixed(1)}g</span>
            </div>
            <Progress value={carbsPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('mealPlan.fat')}</span>
              <span className="text-sm font-medium">{totalFat.toFixed(1)}g</span>
            </div>
            <Progress value={fatPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('mealPlan.remaining')}</span>
              <span className="text-sm font-medium">{remainingCalories}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSidebar;
