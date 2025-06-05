
import React from 'react';
import MealPlanDayView from '@/components/meal-plan/MealPlanDayView';
import MealPlanWeekView from '@/components/meal-plan/MealPlanWeekView';
import EnhancedMealPlanHeader from '@/components/meal-plan/EnhancedMealPlanHeader';

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
  isGenerating: boolean;
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
  isGenerating,
  currentDate,
  currentDay,
  handleRecipeGenerated
}) => {
  // Mock handlers for the header - these should be properly implemented
  const handleGenerateAI = () => {
    console.log('Generate AI clicked');
  };

  const handleShuffle = () => {
    console.log('Shuffle clicked');
  };

  const handleShowShoppingList = () => {
    console.log('Shopping list clicked');
  };

  const handleRegeneratePlan = () => {
    console.log('Regenerate plan clicked');
  };

  const hasWeeklyPlan = !!currentWeekPlan?.weeklyPlan;

  return (
    <div className="min-h-screen">
      <EnhancedMealPlanHeader 
        onGenerateAI={handleGenerateAI}
        onShuffle={handleShuffle}
        onShowShoppingList={handleShowShoppingList}
        onRegeneratePlan={handleRegeneratePlan}
        isGenerating={isGenerating}
        hasWeeklyPlan={hasWeeklyPlan}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'daily' ? (
            <MealPlanDayView
              dailyMeals={dailyMeals}
              isLoading={isLoading}
              onRecipeGenerated={handleRecipeGenerated}
            />
          ) : (
            <MealPlanWeekView
              weeklyPlan={currentWeekPlan}
              isLoading={isLoading}
              onRecipeGenerated={handleRecipeGenerated}
            />
          )}
        </div>
      </div>
    </div>
  );
};
