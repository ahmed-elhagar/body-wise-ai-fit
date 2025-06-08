
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Zap, Calendar, TrendingUp } from 'lucide-react';
import MealGrid from './MealGrid';
import type { DailyMeal, MealPlanFetchResult } from '../types';
import { format, addDays } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

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
  weeklyPlan: MealPlanFetchResult;
  showAddSnackButton?: boolean;
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
  weekStartDate,
  weeklyPlan,
  showAddSnackButton = true,
  currentWeekOffset,
  setCurrentWeekOffset,
  setSelectedDayNumber,
  onGenerateAI,
  isGenerating
}: DayOverviewProps) => {
  const { t, isRTL } = useLanguage();

  const selectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  const getDayName = (dayNumber: number) => {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber - 1] || 'Day';
  };

  return (
    <div className="space-y-6">
      {/* Day Header with Stats */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/50 shadow-lg">
        <div className="p-6">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getDayName(selectedDayNumber)}
                </h2>
                <p className="text-gray-600">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {dailyMeals.length} meals
              </Badge>
              <Badge 
                className={`px-3 py-1 ${
                  calorieProgress >= 80 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : calorieProgress >= 60
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : 'bg-orange-100 text-orange-700 border-orange-200'
                }`}
              >
                {Math.round(calorieProgress)}% complete
              </Badge>
            </div>
          </div>

          {/* Nutrition Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-700">
                    {t('mealPlan.calories') || 'Calories'}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {totalCalories} / {targetDayCalories}
                </span>
              </div>
              <Progress 
                value={calorieProgress} 
                className="h-3 bg-gray-200"
              />
              <div className={`flex justify-between text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{Math.round(calorieProgress)}% of target</span>
                <span>{Math.max(0, targetDayCalories - totalCalories)} remaining</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-700">
                    {t('mealPlan.protein') || 'Protein'}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {totalProtein.toFixed(1)}g / {proteinTarget}g
                </span>
              </div>
              <Progress 
                value={proteinProgress} 
                className="h-3 bg-gray-200"
              />
              <div className={`flex justify-between text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{Math.round(proteinProgress)}% of target</span>
                <span>{Math.max(0, proteinTarget - totalProtein).toFixed(1)}g remaining</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals Grid */}
      <MealGrid
        meals={dailyMeals}
        onShowRecipe={onViewMeal}
        onExchangeMeal={onExchangeMeal}
        onAddSnack={showAddSnackButton ? onAddSnack : undefined}
        dayNumber={selectedDayNumber}
      />
    </div>
  );
};
