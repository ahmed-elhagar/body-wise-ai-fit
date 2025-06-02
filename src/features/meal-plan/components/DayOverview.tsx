
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Target, TrendingUp } from "lucide-react";
import { format } from 'date-fns';
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { getDayName } from '@/utils/mealPlanUtils';
import { EnhancedMealCard } from './EnhancedMealCard';
import { AddMealCard } from './AddMealCard';
import type { DailyMeal } from '../types';

interface DayOverviewProps {
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  weekStartDate: Date;
}

export const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayOverviewProps) => {
  const {
    dailyProgress,
    calorieProgress,
    consumed,
    target,
    cal,
    protein,
    mealTypes,
    language
  } = useMealPlanTranslations();

  const calorieProgressPercent = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  // Group meals by type
  const mealsByType = dailyMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  // Define meal type order and create meal grid
  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
  const allMeals: Array<{ type: 'meal' | 'add'; meal?: DailyMeal; mealType?: string }> = [];

  mealTypeOrder.forEach(mealType => {
    const mealsForType = mealsByType[mealType] || [];
    mealsForType.forEach(meal => {
      allMeals.push({ type: 'meal', meal });
    });
    
    // Add "add meal" card for empty snack slots
    if (['snack1', 'snack2'].includes(mealType) && mealsForType.length === 0) {
      allMeals.push({ type: 'add', mealType: 'snack' });
    }
  });

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {getDayName(selectedDayNumber)}
        </h2>
        <p className="text-gray-600">
          {format(new Date(weekStartDate.getTime() + (selectedDayNumber - 1) * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Daily Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600" />
            {dailyProgress}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calorie Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">{calorieProgress}</span>
              <span className="font-medium">{totalCalories}/{targetDayCalories} {cal}</span>
            </div>
            <Progress value={calorieProgressPercent} className="h-3" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-sm text-gray-600">{consumed}</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-sm text-gray-600">{protein}</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{remainingCalories}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Grid */}
      {allMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMeals.map((item, index) => (
            <div key={index}>
              {item.type === 'meal' && item.meal ? (
                <EnhancedMealCard
                  meal={item.meal}
                  onViewMeal={onViewMeal}
                  onExchangeMeal={onExchangeMeal}
                />
              ) : (
                <AddMealCard
                  mealType={item.mealType}
                  onAddMeal={onAddSnack}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No meals planned for this day</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start planning your meals to reach your daily nutrition goals.
            </p>
            <AddMealCard mealType="snack" onAddMeal={onAddSnack} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
