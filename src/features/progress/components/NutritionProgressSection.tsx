
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Apple, Target, TrendingUp } from "lucide-react";
import { useFoodConsumption } from "@/features/food-tracker/hooks";

const NutritionProgressSection = () => {
  const { todayConsumption, isLoading } = useFoodConsumption();

  const dailyTotals = (todayConsumption || []).reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories_consumed || 0),
      protein: acc.protein + (item.protein_consumed || 0),
      carbs: acc.carbs + (item.carbs_consumed || 0),
      fat: acc.fat + (item.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  const progress = {
    calories: dailyGoals.calories > 0 ? Math.min((dailyTotals.calories / dailyGoals.calories) * 100, 100) : 0,
    protein: dailyGoals.protein > 0 ? Math.min((dailyTotals.protein / dailyGoals.protein) * 100, 100) : 0,
    carbs: dailyGoals.carbs > 0 ? Math.min((dailyTotals.carbs / dailyGoals.carbs) * 100, 100) : 0,
    fat: dailyGoals.fat > 0 ? Math.min((dailyTotals.fat / dailyGoals.fat) * 100, 100) : 0
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Nutrition Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading nutrition data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5" />
          Nutrition Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Calories</span>
            <Badge variant="outline">
              {Math.round(dailyTotals.calories)} / {dailyGoals.calories}
            </Badge>
          </div>
          <Progress value={progress.calories} className="h-2" />
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Protein</span>
            <Badge variant="outline">
              {Math.round(dailyTotals.protein)}g / {dailyGoals.protein}g
            </Badge>
          </div>
          <Progress value={progress.protein} className="h-2" />
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Carbs</span>
            <Badge variant="outline">
              {Math.round(dailyTotals.carbs)}g / {dailyGoals.carbs}g
            </Badge>
          </div>
          <Progress value={progress.carbs} className="h-2" />
        </div>

        {/* Fat */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fat</span>
            <Badge variant="outline">
              {Math.round(dailyTotals.fat)}g / {dailyGoals.fat}g
            </Badge>
          </div>
          <Progress value={progress.fat} className="h-2" />
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>
              {progress.calories >= 90 
                ? "Great job meeting your nutrition goals!" 
                : `${Math.round(dailyGoals.calories - dailyTotals.calories)} calories remaining`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProgressSection;
