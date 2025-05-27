
import { Badge } from "@/components/ui/badge";
import DailySummary from "@/components/DailySummary";
import MealCard from "@/components/MealCard";
import type { Meal } from "@/types/meal";

interface MealPlanContentProps {
  selectedDayNumber: number;
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
}

const MealPlanContent = ({
  selectedDayNumber,
  todaysMeals,
  totalCalories,
  totalProtein,
  onShowShoppingList,
  onShowRecipe,
  onExchangeMeal
}: MealPlanContentProps) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <DailySummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        onShowShoppingList={onShowShoppingList}
      />

      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {dayNames[selectedDayNumber - 1]}'s Meals
          </h2>
          <Badge variant="outline" className="bg-white/80">
            {todaysMeals.length} meals planned
          </Badge>
        </div>
        
        <div className="space-y-4">
          {todaysMeals.map((meal, index) => (
            <MealCard
              key={index}
              meal={meal}
              onShowRecipe={onShowRecipe}
              onExchangeMeal={(meal) => onExchangeMeal(meal, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanContent;
