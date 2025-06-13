
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";

export const MealList = memo(({ meals, onViewMealPlan }: {
  meals: any[];
  onViewMealPlan: () => void;
}) => {
  if (meals.length === 0) {
    return (
      <div className="text-center py-6">
        <Apple className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No meal plan for today</p>
        <Button onClick={onViewMealPlan} className="mt-3" variant="outline" size="sm">
          Generate Meal Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meals.slice(0, 3).map((meal) => (
        <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-sm">{meal.name}</h4>
            <p className="text-xs text-gray-600 capitalize">{meal.meal_type}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">{meal.calories} cal</p>
            <p className="text-xs text-gray-600">{meal.protein}g protein</p>
          </div>
        </div>
      ))}
      {meals.length > 3 && (
        <p className="text-center text-xs text-gray-500">
          +{meals.length - 3} more meals
        </p>
      )}
    </div>
  );
});

MealList.displayName = 'MealList';
