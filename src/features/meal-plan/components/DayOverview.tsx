
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NutritionProgressCard } from './nutrition/NutritionProgressCard';
import { EmptyDayState } from './EmptyDayState';
import { MealListCard } from './MealListCard';
import { useResponsiveSpacing } from '@/hooks/useResponsiveDesign';
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
  const { containerPadding, gap } = useResponsiveSpacing();

  return (
    <div className={`space-y-6 ${containerPadding}`}>
      {/* Enhanced Day Header with Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <NutritionProgressCard
            selectedDayNumber={selectedDayNumber}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            targetDayCalories={targetDayCalories}
            mealCount={dailyMeals.length}
            weekStartDate={weekStartDate}
          />
        </div>
        
        {/* Fixed Add Snack Button with Better Positioning */}
        <div className="flex-shrink-0 lg:ml-4">
          <Button
            onClick={onAddSnack}
            className="w-full lg:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 font-medium rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
        </div>
      </div>

      {/* Enhanced Meals List with Better Spacing */}
      <div className={`space-y-4 ${gap}`}>
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
