
import { Card, CardContent } from "@/components/ui/card";
import type { DailyMeal } from "@/features/meal-plan/types";

interface RecipeNutritionCardProps {
  meal: DailyMeal;
}

export const RecipeNutritionCard = ({ meal }: RecipeNutritionCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Nutrition Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded text-center">
            <span className="font-bold text-green-600">{meal.calories}</span>
            <div className="text-sm text-gray-600">calories</div>
          </div>
          <div className="bg-blue-50 p-3 rounded text-center">
            <span className="font-bold text-blue-600">{meal.protein}g</span>
            <div className="text-sm text-gray-600">protein</div>
          </div>
          <div className="bg-orange-50 p-3 rounded text-center">
            <span className="font-bold text-orange-600">{meal.carbs}g</span>
            <div className="text-sm text-gray-600">carbs</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <span className="font-bold text-yellow-600">{meal.fat}g</span>
            <div className="text-sm text-gray-600">fat</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
