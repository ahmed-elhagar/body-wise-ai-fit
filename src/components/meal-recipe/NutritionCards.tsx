
import { Card } from "@/components/ui/card";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-3 text-center">
        <p className="text-sm text-gray-600">Calories</p>
        <p className="text-lg font-bold text-red-600">{meal.calories}</p>
      </Card>
      <Card className="p-3 text-center">
        <p className="text-sm text-gray-600">Protein</p>
        <p className="text-lg font-bold text-blue-600">{meal.protein}g</p>
      </Card>
      <Card className="p-3 text-center">
        <p className="text-sm text-gray-600">Carbs</p>
        <p className="text-lg font-bold text-yellow-600">{meal.carbs}g</p>
      </Card>
      <Card className="p-3 text-center">
        <p className="text-sm text-gray-600">Fat</p>
        <p className="text-lg font-bold text-green-600">{meal.fat}g</p>
      </Card>
      <Card className="p-3 text-center">
        <p className="text-sm text-gray-600">Total Time</p>
        <p className="text-lg font-bold text-purple-600">{meal.prepTime + meal.cookTime} min</p>
      </Card>
    </div>
  );
};

export default NutritionCards;
