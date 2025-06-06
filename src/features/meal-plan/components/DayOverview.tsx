
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MealRow } from './MealRow';
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
  weeklyPlan: any;
  showAddSnackButton?: boolean;
  // Navigation props
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  setSelectedDayNumber: (day: number) => void;
  // AI generation props
  onGenerateAI?: () => void;
  isGenerating?: boolean;
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
  weekStartDate,
  showAddSnackButton = true
}: DayOverviewProps) => {
  const { t, isRTL } = useLanguage();

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('saturday') || 'Saturday',
      t('sunday') || 'Sunday', 
      t('monday') || 'Monday',
      t('tuesday') || 'Tuesday',
      t('wednesday') || 'Wednesday',
      t('thursday') || 'Thursday',
      t('friday') || 'Friday'
    ];
    return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
  };

  const getDayDate = (dayNumber: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toLocaleDateString();
  };

  const mealTypeOrder = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack'];
  const groupedMeals = dailyMeals.reduce((acc, meal) => {
    const type = meal.meal_type || 'snack';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  const getMealTypeName = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return t('mealPlan.breakfast') || 'Breakfast';
      case 'lunch': return t('mealPlan.lunch') || 'Lunch';
      case 'dinner': return t('mealPlan.dinner') || 'Dinner';
      case 'snack': return t('mealPlan.snack') || 'Snack';
      case 'snack1': return t('mealPlan.snack1') || 'Morning Snack';
      case 'snack2': return t('mealPlan.snack2') || 'Afternoon Snack';
      default: return mealType;
    }
  };

  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const canAddSnack = remainingCalories >= 50;
  const caloriesProgress = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4);
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <div className="space-y-3">
      {/* Compact Day Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-3">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-lg font-bold text-blue-900">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-blue-600 text-xs">
                {getDayDate(selectedDayNumber)}
              </p>
            </div>
            {showAddSnackButton && canAddSnack && (
              <Button
                onClick={onAddSnack}
                size="sm"
                className={`bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('mealPlan.addSnack') || 'Add Snack'}
              </Button>
            )}
          </div>

          {/* Nutrition Progress */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-2 border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {t('mealPlan.calories') || 'Calories'}
                  </span>
                </div>
                <span className="text-xs font-bold text-orange-700">
                  {totalCalories}/{targetDayCalories}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${caloriesProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-2 border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {t('mealPlan.protein') || 'Protein'}
                </span>
                <span className="text-xs font-bold text-blue-700">
                  {totalProtein}/{proteinTarget}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${proteinProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Display - Row Layout */}
      <div className="space-y-3">
        {mealTypeOrder.map(mealType => {
          const mealsOfType = groupedMeals[mealType] || [];
          if (mealsOfType.length === 0) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {getMealTypeName(mealType)}
                  <span className="text-xs text-gray-500 font-normal">
                    ({mealsOfType.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3 space-y-2">
                {mealsOfType.map((meal, index) => (
                  <MealRow
                    key={`${meal.id}-${index}`}
                    meal={meal}
                    onViewMeal={onViewMeal}
                    onExchangeMeal={onExchangeMeal}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* No Meals State */}
        {dailyMeals.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {t('mealPlan.noMealsPlanned') || 'No meals planned for this day'}
              </h3>
              <p className="text-sm text-gray-500">
                {t('mealPlan.generatePlanToSee') || 'Generate a meal plan to see your daily meals'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
