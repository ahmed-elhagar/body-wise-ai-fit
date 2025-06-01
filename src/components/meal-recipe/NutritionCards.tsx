
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Utensils } from "lucide-react";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  const isSnack = meal.name.includes('🍎') || meal.type === 'snack';
  
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          {isSnack ? <Apple className="w-4 h-4 text-fitness-accent-600" /> : <Utensils className="w-4 h-4 text-fitness-primary-600" />}
          Nutrition per serving
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 font-bold text-sm">{meal.calories}</span>
            </div>
            <p className="text-xs text-gray-600">Calories</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold text-sm">{meal.protein}g</span>
            </div>
            <p className="text-xs text-gray-600">Protein</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold text-sm">{meal.carbs}g</span>
            </div>
            <p className="text-xs text-gray-600">Carbs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-600 font-bold text-sm">{meal.fat}g</span>
            </div>
            <p className="text-xs text-gray-600">Fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionCards;
