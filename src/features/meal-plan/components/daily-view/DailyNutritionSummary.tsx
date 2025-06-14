
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Zap } from "lucide-react";
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

  const caloriesProgress = Math.min((totals.calories / targetCalories) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            {String(tMealPlan('dailyNutrition'))}
          </h3>
          <div className="text-lg font-bold text-blue-700">
            {Math.round(totals.calories)} / {targetCalories} cal
          </div>
        </div>

        <Progress value={caloriesProgress} className="h-3 mb-3" />

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-green-500" />
              <span className="font-medium text-gray-600">{String(tMealPlan('protein'))}</span>
            </div>
            <div className="font-bold text-gray-800">{Math.round(totals.protein)}g</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600 mb-1">{String(tMealPlan('carbs'))}</div>
            <div className="font-bold text-gray-800">{Math.round(totals.carbs)}g</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600 mb-1">{String(tMealPlan('fat'))}</div>
            <div className="font-bold text-gray-800">{Math.round(totals.fat)}g</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNutritionSummary;
