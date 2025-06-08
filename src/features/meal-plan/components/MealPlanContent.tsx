
import React from 'react';
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import type { MealPlanFetchResult, DailyMeal } from '@/features/meal-plan/types';

// Import the correct components from their actual locations
import { EmptyWeekState } from '@/features/meal-plan/components/EmptyWeekState';
import WeeklyMealPlanView from '@/components/WeeklyMealPlanView';

// Create a simple daily meal view component within this file to avoid import issues
const DailyMealView = ({ 
  dailyMeals, 
  onViewMeal, 
  onExchangeMeal, 
  onAddSnack, 
  isGenerating, 
  isLoading 
}: {
  dailyMeals: DailyMeal[];
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  isGenerating: boolean;
  isLoading?: boolean;
}) => {
  if (dailyMeals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No meals for this day</h3>
        <p className="text-gray-500">Generate a meal plan to see your daily meals</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {dailyMeals.map((meal, index) => (
        <Card key={meal.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                  {meal.meal_type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{meal.prep_time + meal.cook_time} min</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{meal.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{meal.calories} cal</span>
                <span>{meal.protein}g protein</span>
                <span>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onViewMeal(meal)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                View Recipe
              </button>
              <button
                onClick={() => onExchangeMeal(meal)}
                className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
              >
                Exchange
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

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
      <EmptyWeekState
        onGenerateAI={onGenerateAI}
        isGenerating={isGenerating}
      />
    );
  }

  // Create adapter functions to convert between DailyMeal and Meal types
  const handleShowRecipe = (meal: any) => {
    // Convert Meal to DailyMeal by finding the corresponding daily meal
    const dailyMeal = activeWeekPlan.dailyMeals?.find(dm => dm.id === meal.id || dm.name === meal.name);
    if (dailyMeal) {
      onViewMeal(dailyMeal);
    }
  };

  const handleExchangeMeal = (meal: any, dayNumber?: number, mealIndex?: number) => {
    // Convert Meal to DailyMeal by finding the corresponding daily meal
    const dailyMeal = activeWeekPlan.dailyMeals?.find(dm => dm.id === meal.id || dm.name === meal.name);
    if (dailyMeal) {
      onExchangeMeal(dailyMeal);
    }
  };

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
          onShowRecipe={handleShowRecipe}
          onExchangeMeal={handleExchangeMeal}
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
