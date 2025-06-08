import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Shuffle } from "lucide-react";
import { MealCard } from "@/features/meal-plan/components";
import type { DailyMeal } from "@/features/meal-plan/types";

interface MealGridProps {
  meals: DailyMeal[];
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack?: () => void;
  onShowShoppingList?: () => void;
  onRegeneratePlan?: () => void;
  dayNumber: number;
}

const MealGrid = ({ 
  meals, 
  onShowRecipe, 
  onExchangeMeal, 
  onAddSnack, 
  onShowShoppingList,
  onRegeneratePlan,
  dayNumber 
}: MealGridProps) => {
  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <div className="space-y-6">
      {mealTypeOrder.map(mealType => {
        const typeMeals = mealsByType[mealType] || [];
        if (typeMeals.length === 0 && mealType !== 'snack') return null;

        return (
          <div key={mealType} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {mealType}
              </h3>
              {mealType === 'snack' && (
                <Button
                  onClick={onAddSnack}
                  size="sm"
                  variant="outline"
                  className="text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Snack
                </Button>
              )}
            </div>

            {typeMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeMeals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onShowRecipe={onShowRecipe}
                    onExchangeMeal={onExchangeMeal}
                  />
                ))}
              </div>
            ) : mealType === 'snack' ? (
              <div className="text-center py-8 text-gray-500">
                <p>No snacks planned for this day</p>
                <Button
                  onClick={onAddSnack}
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Quick Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          onClick={onShowShoppingList}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          Shopping List
        </Button>
        <Button
          onClick={onRegeneratePlan}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Regenerate Day
        </Button>
      </div>
    </div>
  );
};

export default MealGrid;
