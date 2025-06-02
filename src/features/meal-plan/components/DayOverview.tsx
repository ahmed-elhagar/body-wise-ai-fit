
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChefHat, Eye, ArrowLeftRight, Plus, Clock, Utensils } from "lucide-react";
import { format } from 'date-fns';
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { getDayName } from '@/utils/mealPlanUtils';
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
    addSnack,
    recipe,
    mealTypes,
    language
  } = useMealPlanTranslations();

  const calorieProgressPercent = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  const mealsByType = dailyMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];

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

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            {dailyProgress}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{calorieProgress}</span>
              <span>{totalCalories}/{targetDayCalories} {cal}</span>
            </div>
            <Progress value={calorieProgressPercent} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-sm text-gray-600">{consumed}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-sm text-gray-600">{protein}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{remainingCalories}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals by Type */}
      <div className="space-y-4">
        {mealTypeOrder.map(mealType => {
          const mealsForType = mealsByType[mealType] || [];
          
          if (mealsForType.length === 0 && !['snack1', 'snack2'].includes(mealType)) {
            return null; // Don't show empty main meals
          }

          return (
            <Card key={mealType}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">
                    {mealTypes[mealType] || mealType}
                  </span>
                  {['snack1', 'snack2'].includes(mealType) && mealsForType.length === 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={onAddSnack}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {addSnack}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mealsForType.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No {mealType} planned</p>
                ) : (
                  <div className="space-y-3">
                    {mealsForType.map((meal) => (
                      <div 
                        key={meal.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {meal.prep_time + meal.cook_time} min
                            </span>
                            <span>{meal.calories} {cal}</span>
                            <span>{meal.protein}g {protein}</span>
                          </div>
                          {meal.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {meal.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {meal.difficulty && (
                            <Badge variant="outline" className="capitalize">
                              {meal.difficulty}
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewMeal(meal)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onExchangeMeal(meal)}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
