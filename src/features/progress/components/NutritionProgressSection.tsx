
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Utensils, Target, TrendingUp, Calendar } from "lucide-react";
import { useFoodTracking } from "@/features/food-tracker/hooks/useFoodTracking";

export const NutritionProgressSection = () => {
  const { todayConsumption, weeklyStats, isLoading, error } = useFoodTracking();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-red-600" />
            Nutrition Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading nutrition data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dailyTargets = {
    calories: 2200,
    protein: 110,
    carbs: 275,
    fat: 73
  };

  const todayCalories = todayConsumption?.calories || 0;
  const todayProtein = todayConsumption?.protein || 0;
  const todayCarbs = todayConsumption?.carbs || 0;
  const todayFat = todayConsumption?.fat || 0;

  const calorieProgress = (todayCalories / dailyTargets.calories) * 100;
  const proteinProgress = (todayProtein / dailyTargets.protein) * 100;
  const carbsProgress = (todayCarbs / dailyTargets.carbs) * 100;
  const fatProgress = (todayFat / dailyTargets.fat) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-orange-600 text-sm font-medium">Calories</p>
              <p className="text-2xl font-bold text-orange-900">{Math.round(todayCalories)}</p>
              <p className="text-xs text-orange-600">/ {dailyTargets.calories} kcal</p>
              <Progress value={Math.min(calorieProgress, 100)} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-blue-600 text-sm font-medium">Protein</p>
              <p className="text-2xl font-bold text-blue-900">{Math.round(todayProtein)}</p>
              <p className="text-xs text-blue-600">/ {dailyTargets.protein}g</p>
              <Progress value={Math.min(proteinProgress, 100)} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-green-600 text-sm font-medium">Carbs</p>
              <p className="text-2xl font-bold text-green-900">{Math.round(todayCarbs)}</p>
              <p className="text-xs text-green-600">/ {dailyTargets.carbs}g</p>
              <Progress value={Math.min(carbsProgress, 100)} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-purple-600 text-sm font-medium">Fat</p>
              <p className="text-2xl font-bold text-purple-900">{Math.round(todayFat)}</p>
              <p className="text-xs text-purple-600">/ {dailyTargets.fat}g</p>
              <Progress value={Math.min(fatProgress, 100)} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Calories', current: todayCalories, target: dailyTargets.calories, unit: 'kcal', color: 'orange' },
              { name: 'Protein', current: todayProtein, target: dailyTargets.protein, unit: 'g', color: 'blue' },
              { name: 'Carbs', current: todayCarbs, target: dailyTargets.carbs, unit: 'g', color: 'green' },
              { name: 'Fat', current: todayFat, target: dailyTargets.fat, unit: 'g', color: 'purple' }
            ].map((macro) => {
              const progress = (macro.current / macro.target) * 100;
              return (
                <div key={macro.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(macro.current)} / {macro.target} {macro.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {Math.round(progress)}% of daily target
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Weekly nutrition analytics coming soon...</p>
            <p className="text-sm text-gray-500 mt-2">
              Track your nutrition patterns and trends over time
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
