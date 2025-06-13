
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NutritionProgressCard } from './nutrition/NutritionProgressCard';
import { EmptyDayState } from './EmptyDayState';
import { MealListCard } from './MealListCard';
import type { DailyMeal } from '@/features/meal-plan/types';

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
}

const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Day Header with Add Snack Button */}
      <div className="flex items-center justify-between">
        <NutritionProgressCard
          selectedDayNumber={selectedDayNumber}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          mealCount={dailyMeals.length}
          weekStartDate={weekStartDate}
        />
        <div className="ml-4">
          <Button
            onClick={onAddSnack}
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
        </div>
      </div>

      {/* Enhanced Meals List */}
      <div className="space-y-4">
        {dailyMeals.length > 0 ? (
          dailyMeals.map((meal) => (
            <MealListCard
              key={meal.id}
              meal={meal}
              onViewMeal={onViewMeal}
              onExchangeMeal={onExchangeMeal}
            />
          ))
        ) : (
          <EmptyDayState onAddSnack={onAddSnack} />
        )}
      </div>
    </div>
  );
};

export default DayOverview;
