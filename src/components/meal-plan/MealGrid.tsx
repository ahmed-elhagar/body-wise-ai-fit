
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Shuffle } from "lucide-react";
import MealCard from "./MealCard";
import type { DailyMeal } from "@/hooks/useMealPlanData";

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
  console.log('🍽️ MealGrid rendered with:', {
    mealsCount: meals.length,
    dayNumber,
    hasShowRecipeHandler: !!onShowRecipe,
    hasExchangeMealHandler: !!onExchangeMeal,
    onShowRecipeType: typeof onShowRecipe,
    onExchangeMealType: typeof onExchangeMeal
  });

  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Test button handler
  const handleTestClick = () => {
    console.log('🧪 TEST BUTTON CLICKED! This proves buttons can fire in this context');
    alert('Test button works!');
  };
  
  return (
    <div className="space-y-6">
      {/* TEST BUTTON - Remove this after testing */}
      <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
        <h3 className="text-red-800 font-bold mb-2">🧪 TEST AREA - Remove after testing</h3>
        <Button
          onClick={handleTestClick}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          🧪 TEST BUTTON - Click me to verify buttons work
        </Button>
        <p className="text-sm text-red-700 mt-2">If this button works, the issue is specific to MealCard buttons</p>
      </div>

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
                {typeMeals.map((meal) => {
                  console.log('🍽️ Rendering MealCard for:', meal.name, 'with handlers:', {
                    hasShowRecipe: !!onShowRecipe,
                    hasExchangeMeal: !!onExchangeMeal
                  });
                  return (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onShowRecipe={onShowRecipe}
                      onExchangeMeal={onExchangeMeal}
                    />
                  );
                })}
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
