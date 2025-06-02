
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Utensils } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedMealCard from './EnhancedMealCard';
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
  weeklyPlan,
  showAddSnackButton = true
}: DayOverviewProps) => {
  const { t, isRTL } = useLanguage();

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('navigation.days.saturday') || 'Saturday',
      t('navigation.days.sunday') || 'Sunday', 
      t('navigation.days.monday') || 'Monday',
      t('navigation.days.tuesday') || 'Tuesday',
      t('navigation.days.wednesday') || 'Wednesday',
      t('navigation.days.thursday') || 'Thursday',
      t('navigation.days.friday') || 'Friday'
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

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack':
      case 'snack1':
      case 'snack2': return '🍎';
      default: return '🍽️';
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-6 h-6 text-blue-600" />
            <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
              <h2 className="text-2xl font-bold text-blue-900">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-blue-600 text-sm">
                {getDayDate(selectedDayNumber)}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Meals Display */}
      <div className="space-y-4">
        {mealTypeOrder.map(mealType => {
          const mealsOfType = groupedMeals[mealType] || [];
          if (mealsOfType.length === 0) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl">{getMealTypeIcon(mealType)}</span>
                  {getMealTypeName(mealType)}
                  <span className="text-sm text-gray-500 font-normal">
                    ({mealsOfType.length} {mealsOfType.length === 1 ? t('mealPlan.item') || 'item' : t('mealPlan.items') || 'items'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mealsOfType.map((meal, index) => (
                    <EnhancedMealCard
                      key={`${meal.id}-${index}`}
                      meal={meal}
                      onShowRecipe={onViewMeal}
                      onExchangeMeal={onExchangeMeal}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Snack Button - Only show once if enabled and conditions are met */}
        {showAddSnackButton && canAddSnack && (
          <Card className="border-dashed border-2 border-green-300 bg-green-50/50">
            <CardContent className="p-6">
              <div className={`text-center space-y-3 ${isRTL ? 'rtl' : ''}`}>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">
                    {t('mealPlan.addSnack.title') || 'Add a Healthy Snack'}
                  </h3>
                  <p className="text-sm text-green-600 mb-3">
                    {t('mealPlan.addSnack.description') || 'You have'} {remainingCalories} {t('mealPlan.addSnack.caloriesLeft') || 'calories left for today'}
                  </p>
                </div>
                <Button
                  onClick={onAddSnack}
                  className={`bg-green-600 hover:bg-green-700 text-white ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('mealPlan.addSnack.button') || 'Add Snack'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Meals State */}
        {dailyMeals.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {t('mealPlan.noMealsPlanned') || 'No meals planned for this day'}
              </h3>
              <p className="text-gray-500">
                {t('mealPlan.generatePlanToSee') || 'Generate a meal plan to see your daily meals'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
