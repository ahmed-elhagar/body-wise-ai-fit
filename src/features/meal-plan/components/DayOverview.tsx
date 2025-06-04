
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Utensils } from 'lucide-react';
import MealCard from '@/components/meal-plan/MealCard';
import type { DailyMeal, MealPlanFetchResult } from '../types';

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
  weeklyPlan: MealPlanFetchResult | null;
  showAddSnackButton: boolean;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  setSelectedDayNumber: (day: number) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
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
  showAddSnackButton
}: DayOverviewProps) => {
  const calorieProgress = targetDayCalories > 0 
    ? Math.min((totalCalories / targetDayCalories) * 100, 100) 
    : 0;

  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const snacks = dailyMeals.filter(meal => meal.meal_type.includes('snack'));

  return (
    <div className="space-y-6">
      {/* Day Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Day {selectedDayNumber} Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCalories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dailyMeals.length}</div>
              <div className="text-sm text-gray-600">Meals</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calorie Progress</span>
              <span>{totalCalories} / {targetDayCalories}</span>
            </div>
            <Progress value={calorieProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Meals */}
      <div className="space-y-4">
        {mealTypes.map((mealType) => {
          const meal = dailyMeals.find(m => m.meal_type === mealType);
          
          return (
            <Card key={mealType}>
              <CardHeader>
                <CardTitle className="capitalize flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  {mealType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meal ? (
                  <MealCard
                    meal={meal}
                    onShowRecipe={onViewMeal}
                    onExchangeMeal={onExchangeMeal}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No {mealType} planned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Snacks Section */}
      {(snacks.length > 0 || showAddSnackButton) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Snacks
              </span>
              {showAddSnackButton && (
                <Button onClick={onAddSnack} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {snacks.length > 0 ? (
              <div className="grid gap-4">
                {snacks.map((snack) => (
                  <MealCard
                    key={snack.id}
                    meal={snack}
                    onShowRecipe={onViewMeal}
                    onExchangeMeal={onExchangeMeal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No snacks added</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
