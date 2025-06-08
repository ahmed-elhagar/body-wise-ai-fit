
import React from 'react';
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DailyMealView from '@/components/daily-view/DailyMealView';
import WeeklyMealPlanView from '@/components/WeeklyMealPlanView';
import EmptyMealPlanState from '@/components/meal-plan/EmptyMealPlanState';
import { format } from 'date-fns';
import type { MealPlanFetchResult, DailyMeal } from '@/features/meal-plan/types';

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  currentWeekPlan: MealPlanFetchResult | null;
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  weekStartDate: Date;
  currentWeekOffset: number;
  isGenerating: boolean;
  isLoading?: boolean;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  onGenerateAI: () => void;
  setCurrentWeekOffset: (offset: number) => void;
  setSelectedDayNumber: (day: number) => void;
}

export const MealPlanContent = ({
  viewMode,
  currentWeekPlan,
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  weekStartDate,
  currentWeekOffset,
  isGenerating,
  isLoading = false,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  onGenerateAI,
  setCurrentWeekOffset,
  setSelectedDayNumber,
}: MealPlanContentProps) => {

  // Check if the week plan is active (not expired or too far in future)
  const isWeekPlanActive = (weekPlan: any) => {
    if (!weekPlan?.week_start_date) return false;
    
    const planDate = new Date(weekPlan.week_start_date);
    const today = new Date();
    const diffInDays = (today.getTime() - planDate.getTime()) / (1000 * 3600 * 24);
    
    // Consider a plan active if it's within 30 days old or future
    return diffInDays >= -30 && diffInDays <= 30;
  };

  // Filter out inactive week plans
  const activeWeekPlan = currentWeekPlan?.weeklyPlan && isWeekPlanActive(currentWeekPlan.weeklyPlan) 
    ? currentWeekPlan 
    : null;

  if (!activeWeekPlan?.weeklyPlan) {
    return (
      <EmptyMealPlanState
        onGenerateAI={onGenerateAI}
        weekStartDate={weekStartDate}
        isGenerating={isGenerating}
      />
    );
  }

  if (viewMode === 'weekly') {
    return (
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-violet-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Weekly Overview</h2>
                <p className="text-sm text-gray-600">
                  Week of {format(weekStartDate, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-violet-600 border-violet-200">
              {activeWeekPlan.dailyMeals?.length || 0} meals planned
            </Badge>
          </div>
        </div>

        <WeeklyMealPlanView
          weeklyPlan={activeWeekPlan}
          onShowRecipe={onViewMeal}
          onExchangeMeal={(meal, dayNumber, mealIndex) => onExchangeMeal(meal)}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Summary Card */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-violet-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Day {selectedDayNumber} Meals
              </h2>
              <p className="text-sm text-gray-600">
                {format(weekStartDate, 'MMM d, yyyy')} - {dailyMeals.length} meals
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Daily Progress</span>
            <span>{totalCalories} / {targetDayCalories} calories</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((totalCalories / targetDayCalories) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      </Card>

      {/* Daily Meal View */}
      <DailyMealView
        dailyMeals={dailyMeals}
        onViewMeal={onViewMeal}
        onExchangeMeal={onExchangeMeal}
        onAddSnack={onAddSnack}
        isGenerating={isGenerating}
        isLoading={isLoading}
      />
    </div>
  );
};
