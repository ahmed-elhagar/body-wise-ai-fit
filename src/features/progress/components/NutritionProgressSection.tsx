
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Utensils, Target, TrendingUp, Calendar, Apple, Droplets } from "lucide-react";
import { useFoodTracking } from "@/features/food-tracker/hooks/useFoodTracking";

export const NutritionProgressSection = () => {
  const { foodConsumption, isLoading, getTodaysConsumption, getNutritionSummary } = useFoodTracking();

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

  const todayConsumption = getTodaysConsumption();
  const todayNutrition = getNutritionSummary();

  // Calculate daily targets (these would ideally come from user profile)
  const dailyTargets = {
    calories: 2200,
    protein: 110,
    carbs: 275,
    fat: 73,
    fiber: 25,
    water: 2000 // ml
  };

  const todayCalories = todayNutrition.totalCalories || 0;
  const todayProtein = todayNutrition.totalProtein || 0;
  const todayCarbs = todayNutrition.totalCarbs || 0;
  const todayFat = todayNutrition.totalFat || 0;

  const calorieProgress = (todayCalories / dailyTargets.calories) * 100;
  const proteinProgress = (todayProtein / dailyTargets.protein) * 100;
  const carbsProgress = (todayCarbs / dailyTargets.carbs) * 100;
  const fatProgress = (todayFat / dailyTargets.fat) * 100;

  return (
    <div className="space-y-6">
      {/* Enhanced Macro Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-900">{Math.round(todayCalories)}</p>
                <p className="text-xs text-orange-600">/ {dailyTargets.calories} kcal</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-orange-600 text-sm font-medium">Calories</p>
                <span className="text-xs text-orange-700">{Math.round(calorieProgress)}%</span>
              </div>
              <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">{Math.round(todayProtein)}</p>
                <p className="text-xs text-blue-600">/ {dailyTargets.protein}g</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-blue-600 text-sm font-medium">Protein</p>
                <span className="text-xs text-blue-700">{Math.round(proteinProgress)}%</span>
              </div>
              <Progress value={Math.min(proteinProgress, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">{Math.round(todayCarbs)}</p>
                <p className="text-xs text-green-600">/ {dailyTargets.carbs}g</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-green-600 text-sm font-medium">Carbs</p>
                <span className="text-xs text-green-700">{Math.round(carbsProgress)}%</span>
              </div>
              <Progress value={Math.min(carbsProgress, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-900">{Math.round(todayFat)}</p>
                <p className="text-xs text-purple-600">/ {dailyTargets.fat}g</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-purple-600 text-sm font-medium">Fat</p>
                <span className="text-xs text-purple-700">{Math.round(fatProgress)}%</span>
              </div>
              <Progress value={Math.min(fatProgress, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Today's Nutrition Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { 
                name: 'Calories', 
                current: todayCalories, 
                target: dailyTargets.calories, 
                unit: 'kcal', 
                color: 'orange',
                progress: calorieProgress 
              },
              { 
                name: 'Protein', 
                current: todayProtein, 
                target: dailyTargets.protein, 
                unit: 'g', 
                color: 'blue',
                progress: proteinProgress 
              },
              { 
                name: 'Carbs', 
                current: todayCarbs, 
                target: dailyTargets.carbs, 
                unit: 'g', 
                color: 'green',
                progress: carbsProgress 
              },
              { 
                name: 'Fat', 
                current: todayFat, 
                target: dailyTargets.fat, 
                unit: 'g', 
                color: 'purple',
                progress: fatProgress 
              }
            ].map((macro) => (
              <div key={macro.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-800">
                      {Math.round(macro.current)} / {macro.target} {macro.unit}
                    </span>
                    <div className="text-xs text-gray-500">
                      {Math.round(macro.progress)}% of daily goal
                    </div>
                  </div>
                </div>
                <Progress value={Math.min(macro.progress, 100)} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 {macro.unit}</span>
                  <span>{macro.target} {macro.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      {todayConsumption.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Today's Food Log ({todayConsumption.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayConsumption.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">Food Item</h4>
                      <p className="text-xs text-gray-600">
                        {item.meal_type || 'Snack'} • {new Date(item.consumed_at || '').toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-800">
                      {Math.round(item.calories_consumed)} kcal
                    </span>
                    <p className="text-xs text-gray-500">
                      P: {Math.round(item.protein_consumed)}g • C: {Math.round(item.carbs_consumed)}g • F: {Math.round(item.fat_consumed)}g
                    </p>
                  </div>
                </div>
              ))}
              {todayConsumption.length > 5 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  And {todayConsumption.length - 5} more items...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {todayConsumption.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Food Logged Today</h3>
            <p className="text-gray-600 mb-4">
              Start tracking your nutrition to see detailed progress insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
