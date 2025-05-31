
import { Card, CardContent } from "@/components/ui/card";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{meal.calories}</div>
          <div className="text-red-500 text-sm font-medium">Calories</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{meal.protein}g</div>
          <div className="text-blue-500 text-sm font-medium">Protein</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{meal.carbs}g</div>
          <div className="text-green-500 text-sm font-medium">Carbs</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{meal.fat}g</div>
          <div className="text-yellow-500 text-sm font-medium">Fat</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionCards;
