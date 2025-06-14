
import { Card } from "@/components/ui/card";
import { DayOverviewHeader, DayNutritionStats, DayMealList, EmptyDayState } from './day-overview';
import type { DailyMeal } from "@/features/meal-plan/types";

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
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <DayOverviewHeader
          selectedDayNumber={selectedDayNumber}
          weekStartDate={weekStartDate}
          onAddSnack={onAddSnack}
        />
        <DayNutritionStats
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          targetDayCalories={targetDayCalories}
          dailyMealsCount={dailyMeals.length}
        />
      </Card>
      
      {dailyMeals.length > 0 ? (
        <DayMealList
          dailyMeals={dailyMeals}
          onViewMeal={onViewMeal}
          onExchangeMeal={onExchangeMeal}
        />
      ) : (
        <EmptyDayState onAddSnack={onAddSnack} />
      )}
    </div>
  );
};

export default DayOverview;
