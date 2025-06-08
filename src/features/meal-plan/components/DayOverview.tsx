
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { MealRow } from './MealRow';
import type { DailyMeal, MealPlanFetchResult } from '../types';

interface DayOverviewProps {
  dayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  weekStartDate: Date;
  weeklyPlan: MealPlanFetchResult;
  showAddSnackButton?: boolean;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  setSelectedDayNumber: (day: number) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const DayOverview = ({
  dayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate,
  weeklyPlan,
  showAddSnackButton = true,
  currentWeekOffset,
  setCurrentWeekOffset,
  setSelectedDayNumber,
  onGenerateAI,
  isGenerating
}: DayOverviewProps) => {
  const { t, isRTL } = useI18n();

  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Day Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Day {dayNumber}</span>
            <Badge variant="secondary" className="ml-auto">
              {dailyMeals.length} meals
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calories Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-lg font-bold text-blue-600">
                  {totalCalories} / {targetDayCalories}
                </span>
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(calorieProgress)}% of daily target
              </p>
            </div>

            {/* Protein Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Protein</span>
                <span className="text-lg font-bold text-green-600">
                  {totalProtein.toFixed(1)}g / {proteinTarget}g
                </span>
              </div>
              <Progress value={proteinProgress} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(proteinProgress)}% of protein target
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Today's Meals
            </CardTitle>
            {showAddSnackButton && (
              <Button onClick={onAddSnack} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Snack
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyMeals.map((meal, index) => (
              <MealRow
                key={meal.id}
                meal={meal}
                mealIndex={index}
                dayNumber={dayNumber}
                onShowRecipe={onViewMeal}
                onExchangeMeal={onExchangeMeal}
              />
            ))}
            
            {dailyMeals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No meals planned for this day</p>
                <Button onClick={onGenerateAI} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Meals'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
