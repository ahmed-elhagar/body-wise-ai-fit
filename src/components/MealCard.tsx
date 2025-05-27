
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Meal {
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  imageUrl?: string;
  image: string;
}

interface MealCardProps {
  meal: Meal;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealCard = ({ meal, onShowRecipe, onExchangeMeal }: MealCardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{meal.image}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="secondary" className="text-xs">
                {meal.type}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {meal.time}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{meal.name}</h3>
            
            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="font-semibold text-fitness-primary">{meal.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="font-semibold text-green-600">{meal.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="font-semibold text-blue-600">{meal.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="font-semibold text-orange-600">{meal.fat}g</p>
              </div>
            </div>

            {/* Meal Details */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {meal.cookTime}min
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {meal.servings} serving
              </div>
            </div>

            {/* Ingredients */}
            <div className="flex flex-wrap gap-2">
              {(meal.ingredients || []).slice(0, 4).map((ingredient, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                  {typeof ingredient === 'string' ? ingredient : ingredient.name}
                </Badge>
              ))}
              {(meal.ingredients || []).length > 4 && (
                <Badge variant="outline" className="text-xs bg-gray-50">
                  +{(meal.ingredients || []).length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/80"
            onClick={() => onShowRecipe(meal)}
          >
            <ChefHat className="w-4 h-4 mr-1" />
            Recipe
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/80"
            onClick={() => onExchangeMeal(meal)}
          >
            Exchange
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
