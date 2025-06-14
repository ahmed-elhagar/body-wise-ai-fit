
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";
import type { DailyMeal } from "@/features/meal-plan/types";

interface DailyNutritionSummaryProps {
  meals: DailyMeal[];
  targetCalories?: number;
}

const DailyNutritionSummary = ({ meals, targetCalories = 2000 }: DailyNutritionSummaryProps) => {
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieProgress = (totals.calories / targetCalories) * 100;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {String(tMealPlan('dailyNutrition'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{String(tMealPlan('calories'))}</span>
            <span>{totals.calories} / {targetCalories}</span>
          </div>
          <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-900">{Math.round(totals.protein)}g</div>
            <div className="text-gray-600">{String(tMealPlan('protein'))}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{Math.round(totals.carbs)}g</div>
            <div className="text-gray-600">{String(tMealPlan('carbs'))}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{Math.round(totals.fat)}g</div>
            <div className="text-gray-600">{String(tMealPlan('fat'))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNutritionSummary;
