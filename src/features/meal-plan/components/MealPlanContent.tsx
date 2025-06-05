
import React from 'react';
import { MealPlanHeader } from '@/components/meal-plan/MealPlanHeader';
import { MealPlanDayView } from '@/components/meal-plan/MealPlanDayView';
import { MealPlanWeekView } from '@/components/meal-plan/MealPlanWeekView';
import { EnhancedMealPlanHeader } from '@/components/meal-plan/EnhancedMealPlanHeader';

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  setViewMode: (mode: 'daily' | 'weekly') => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekDays: any[];
  currentWeekPlan: any;
  todaysMeals: any[];
  dailyMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  isLoading: boolean;
  currentDate: string;
  currentDay: string;
  handleRecipeGenerated: () => void;
}

export const MealPlanContent: React.FC<MealPlanContentProps> = ({
  viewMode,
  setViewMode,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekDays,
  currentWeekPlan,
  todaysMeals,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  isLoading,
  currentDate,
  currentDay,
  handleRecipeGenerated
}) => {
  return (
    <div className="min-h-screen">
      <EnhancedMealPlanHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekDays={weekDays}
        currentWeekPlan={currentWeekPlan}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        targetDayCalories={targetDayCalories}
        currentDate={currentDate}
        currentDay={currentDay}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'daily' ? (
            <MealPlanDayView
              selectedDayNumber={selectedDayNumber}
              dailyMeals={dailyMeals}
              isLoading={isLoading}
              onRecipeGenerated={handleRecipeGenerated}
            />
          ) : (
            <MealPlanWeekView
              currentWeekPlan={currentWeekPlan}
              weekDays={weekDays}
              isLoading={isLoading}
              onRecipeGenerated={handleRecipeGenerated}
            />
          )}
        </div>
      </div>
    </div>
  );
};
