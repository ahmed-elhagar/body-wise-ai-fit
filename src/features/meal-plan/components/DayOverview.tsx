
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Utensils, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { EnhancedMealCard } from './EnhancedMealCard';
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
  weeklyPlan,
  showAddSnackButton = true,
  currentWeekOffset,
  setCurrentWeekOffset,
  setSelectedDayNumber,
  onGenerateAI,
  isGenerating = false
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

  const getWeekDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
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
  const caloriesProgress = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4);
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <div className="space-y-4">
      {/* Enhanced Header with Page Title and AI Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-xl font-bold text-blue-900">
                  {t('mealPlan.title') || 'Meal Plan'}
                </h1>
                <p className="text-sm text-blue-600">
                  {t('mealPlan.subtitle') || 'Your personalized nutrition journey starts here'}
                </p>
              </div>
            </div>
            {onGenerateAI && (
              <Button
                onClick={onGenerateAI}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="sm"
              >
                <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isGenerating ? (t('generating') || 'Generating...') : (t('mealPlan.generateAIMealPlan') || 'Generate AI Plan')}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Compact Navigation & Progress */}
      <Card className="bg-white border-blue-200">
        <CardContent className="p-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="border-blue-300 hover:bg-blue-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="font-medium text-blue-900 flex items-center gap-2 text-sm">
                <Calendar className="w-3 h-3" />
                {getWeekDateRange()}
              </div>
              <p className="text-xs text-blue-600">
                {currentWeekOffset === 0 ? (t('mealPlan.thisWeek') || 'This Week') : 
                 currentWeekOffset > 0 ? `${currentWeekOffset} ${t('mealPlan.weeksAhead') || 'weeks ahead'}` :
                 `${Math.abs(currentWeekOffset)} ${t('mealPlan.weeksAgo') || 'weeks ago'}`}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="border-blue-300 hover:bg-blue-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Selection */}
          <div className="mb-4">
            <div className={`grid grid-cols-7 gap-1 ${isRTL ? 'direction-rtl' : ''}`}>
              {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
                const isSelected = selectedDayNumber === dayNumber;
                const isToday = new Date().toDateString() === new Date(weekStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toDateString();
                
                return (
                  <Button
                    key={dayNumber}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDayNumber(dayNumber)}
                    className={`flex flex-col items-center h-12 relative text-xs ${
                      isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="font-medium">
                      {getDayName(dayNumber).slice(0, 3)}
                    </span>
                    <span className="text-xs">
                      {getDayDate(dayNumber).split('/')[1]}
                    </span>
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Current Day & Add Snack */}
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
                className={`bg-green-600 hover:bg-green-700 text-white ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('mealPlan.addSnack.button') || 'Add Snack'}
              </Button>
            )}
          </div>

          {/* Compact Nutrition Progress */}
          <div className="grid grid-cols-2 gap-3">
            {/* Calories Progress */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-orange-900">
                  {t('mealPlan.calories') || 'Calories'}
                </span>
                <span className="text-sm font-bold text-orange-700">
                  {totalCalories} / {targetDayCalories}
                </span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${caloriesProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-600">
                {remainingCalories} {t('mealPlan.caloriesRemaining') || 'remaining'}
              </p>
            </div>

            {/* Protein Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-900">
                  {t('mealPlan.protein') || 'Protein'}
                </span>
                <span className="text-sm font-bold text-blue-700">
                  {totalProtein}g / {proteinTarget}g
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${proteinProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600">
                {Math.round(proteinProgress)}% {t('mealPlan.ofTarget') || 'of target'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Display - Compact Grid */}
      <div className="space-y-3">
        {mealTypeOrder.map(mealType => {
          const mealsOfType = groupedMeals[mealType] || [];
          if (mealsOfType.length === 0) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-base ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                  {getMealTypeName(mealType)}
                  <span className="text-xs text-gray-500 font-normal">
                    ({mealsOfType.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`${mealsOfType.length === 1 ? 'max-w-md' : 'grid gap-3 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {mealsOfType.map((meal, index) => (
                    <EnhancedMealCard
                      key={`${meal.id}-${index}`}
                      meal={meal}
                      onViewMeal={onViewMeal}
                      onExchangeMeal={onExchangeMeal}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* No Meals State */}
        {dailyMeals.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <Utensils className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-600 mb-2">
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
