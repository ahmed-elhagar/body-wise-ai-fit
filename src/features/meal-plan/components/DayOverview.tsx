import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Utensils, ChevronLeft, ChevronRight, Sparkles, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { EnhancedMealCard } from './EnhancedMealCard';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
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
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();

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

  const getWeekDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const handleShuffleMeals = async () => {
    if (weeklyPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(weeklyPlan.weeklyPlan.id);
      if (success) {
        window.location.reload();
      }
    }
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
    <div className="space-y-3">
      {/* Compact Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-lg font-bold text-blue-900">
                  {t('mealPlan.title') || 'Meal Plan'}
                </h1>
                <p className="text-xs text-blue-600">
                  {t('mealPlan.personalizedNutrition') || 'Personalized nutrition for your goals'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {weeklyPlan?.weeklyPlan?.id && (
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isShuffling}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 border-blue-300 hover:bg-blue-50 text-xs"
                >
                  <Shuffle className="w-3 h-3 mr-1" />
                  {t('mealPlan.shuffleMeals') || 'Shuffle'}
                </Button>
              )}
              {onGenerateAI && (
                <Button
                  onClick={onGenerateAI}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-7 px-3 text-xs"
                  size="sm"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {isGenerating ? (t('generating') || 'Generating...') : (t('mealPlan.generateAI') || 'AI Generate')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation & Stats */}
      <Card className="bg-white border-blue-200">
        <CardContent className="p-3">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            
            <div className="text-center">
              <div className="text-xs font-medium text-blue-900 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {getWeekDateRange()}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Day Selection */}
          <div className="mb-2">
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
                    className={`flex flex-col items-center h-10 relative text-xs ${
                      isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="font-medium text-xs">
                      {getDayName(dayNumber).slice(0, 3)}
                    </span>
                    <span className="text-xs opacity-75">
                      {getDayDate(dayNumber).split('/')[1]}
                    </span>
                    {isToday && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Day Header with Add Snack */}
          <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-base font-bold text-blue-900">
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
                className={`bg-green-600 hover:bg-green-700 text-white h-6 px-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('mealPlan.addSnack') || 'Add Snack'}
              </Button>
            )}
          </div>

          {/* Nutrition Progress */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-orange-900">
                  {t('mealPlan.calories') || 'Calories'}
                </span>
                <span className="text-xs font-bold text-orange-700">
                  {totalCalories}/{targetDayCalories}
                </span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${caloriesProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-900">
                  {t('mealPlan.protein') || 'Protein'}
                </span>
                <span className="text-xs font-bold text-blue-700">
                  {totalProtein}/{proteinTarget}g
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${proteinProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shuffling Loading State */}
      {isShuffling && (
        <EnhancedLoadingIndicator
          status="loading"
          type="meal-plan"
          message={t('mealPlan.shuffling') || 'Shuffling meals across the week...'}
          description={t('mealPlan.shufflingDesc') || 'Redistributing your meals for variety'}
          variant="card"
          size="md"
          showSteps={true}
        />
      )}

      {/* Meals Display - Horizontal Layout */}
      <div className="space-y-2">
        {mealTypeOrder.map(mealType => {
          const mealsOfType = groupedMeals[mealType] || [];
          if (mealsOfType.length === 0) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <CardHeader className="pb-1 pt-2">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-base">{getMealTypeIcon(mealType)}</span>
                  {getMealTypeName(mealType)}
                  <span className="text-xs text-gray-500 font-normal">
                    ({mealsOfType.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {mealsOfType.map((meal, index) => (
                    <div key={`${meal.id}-${index}`}>
                      <EnhancedMealCard
                        meal={meal}
                        onViewMeal={onViewMeal}
                        onExchangeMeal={onExchangeMeal}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* No Meals State */}
        {dailyMeals.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-4 text-center">
              <Utensils className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-600 mb-1">
                {t('mealPlan.noMealsPlanned') || 'No meals planned for this day'}
              </h3>
              <p className="text-xs text-gray-500">
                {t('mealPlan.generatePlanToSee') || 'Generate a meal plan to see your daily meals'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
