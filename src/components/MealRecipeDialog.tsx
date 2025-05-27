
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat } from "lucide-react";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface MealRecipe {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}

interface MealRecipeDialogProps {
  meal: MealRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const MealRecipeDialog = ({ meal, isOpen, onClose }: MealRecipeDialogProps) => {
  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{meal.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image and Basic Info */}
          <div className="space-y-4">
            {meal.imageUrl && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={meal.imageUrl} 
                  alt={meal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&h=300&fit=crop";
                  }}
                />
              </div>
            )}
            
            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-fitness-gradient rounded-lg text-white">
                <p className="text-sm opacity-90">Calories</p>
                <p className="text-lg font-bold">{meal.calories}</p>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-700">Protein</p>
                <p className="text-lg font-bold text-green-800">{meal.protein}g</p>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-700">Carbs</p>
                <p className="text-lg font-bold text-blue-800">{meal.carbs}g</p>
              </div>
              <div className="text-center p-3 bg-orange-100 rounded-lg">
                <p className="text-sm text-orange-700">Fat</p>
                <p className="text-lg font-bold text-orange-800">{meal.fat}g</p>
              </div>
            </div>

            {/* Timing and Servings */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Prep: {meal.prepTime}min
              </div>
              <div className="flex items-center">
                <ChefHat className="w-4 h-4 mr-1" />
                Cook: {meal.cookTime}min
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Serves: {meal.servings}
              </div>
            </div>
          </div>

          {/* Ingredients and Instructions */}
          <div className="space-y-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="space-y-2">
                {meal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{ingredient.name}</span>
                    <Badge variant="outline">{ingredient.quantity} {ingredient.unit}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <div className="space-y-3">
                {meal.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-fitness-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-fitness-gradient hover:opacity-90 text-white">
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
