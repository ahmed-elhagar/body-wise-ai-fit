import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { GoalProgressRing } from "@/features/goals";

interface GoalProgressWidgetProps {
  targetCalories: number;
  currentCalories: number;
  proteinIntake: number;
  carbsIntake: number;
  fatIntake: number;
}

const GoalProgressWidget = ({
  targetCalories,
  currentCalories,
  proteinIntake,
  carbsIntake,
  fatIntake
}: GoalProgressWidgetProps) => {
  const { tFrom } = useI18n();
  const tDashboard = tFrom('dashboard');

  const calorieProgress = (currentCalories / targetCalories) * 100;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {String(tDashboard('dailyProgress'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{String(tDashboard('calories'))}</span>
            <span>{currentCalories} / {targetCalories}</span>
          </div>
          <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-900">{proteinIntake}g</div>
            <div className="text-gray-600">{String(tDashboard('protein'))}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{carbsIntake}g</div>
            <div className="text-gray-600">{String(tDashboard('carbs'))}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{fatIntake}g</div>
            <div className="text-gray-600">{String(tDashboard('fat'))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
