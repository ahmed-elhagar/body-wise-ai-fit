
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Play, Lightbulb } from "lucide-react";

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
  youtubeId?: string;
  tips?: string[];
}

interface MealRecipeDialogProps {
  meal: MealRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const MealRecipeDialog = ({ meal, isOpen, onClose }: MealRecipeDialogProps) => {
  if (!meal) return null;

  const ingredients = meal.ingredients || [];
  const instructions = meal.instructions || [];
  const tips = meal.tips || [];

  const handleWatchVideo = () => {
    if (meal.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${meal.youtubeId}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            {meal.name}
            {meal.youtubeId && (
              <Button 
                onClick={handleWatchVideo}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Recipe
              </Button>
            )}
          </DialogTitle>
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
            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              {ingredients.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded border-l-4 border-fitness-primary">
                      <span className="font-medium">{ingredient.name}</span>
                      <Badge variant="outline" className="bg-white">
                        {ingredient.quantity} {ingredient.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No ingredients available</p>
              )}
            </div>

            {/* Tips */}
            {tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Chef's Tips
                </h3>
                <div className="space-y-2">
                  {tips.map((tip, index) => (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p className="text-sm text-yellow-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Step-by-Step Instructions</h3>
              {instructions.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-fitness-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No instructions available</p>
              )}
            </div>

            {/* YouTube Video Embed */}
            {meal.youtubeId && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Video Tutorial</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${meal.youtubeId}`}
                    title="Recipe Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            Total Time: {meal.prepTime + meal.cookTime} minutes
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-fitness-gradient hover:opacity-90 text-white">
              Save Recipe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
