
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Play, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealRecipe } from "@/hooks/useMealRecipe";
import type { Meal } from "@/types/meal";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
}

const MealRecipeDialog = ({ isOpen, onClose, meal }: MealRecipeDialogProps) => {
  const { t } = useLanguage();
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;

  const handleGenerateRecipe = async () => {
    // Ensure we have a meal ID before trying to generate recipe
    if (!meal.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    const result = await generateRecipe(meal.id);
    if (result) {
      setDetailedMeal(result);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Check if meal already has detailed recipe
      if (meal.ingredients?.length > 0 && meal.instructions?.length > 0) {
        setDetailedMeal(meal);
      } else {
        setDetailedMeal(null);
      }
    }
  }, [isOpen, meal]);

  const openYouTubeSearch = () => {
    const searchTerm = detailedMeal?.youtube_search_term || detailedMeal?.youtubeId || `${meal.name} recipe`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <ChefHat className="w-6 h-6 text-fitness-primary" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{meal.name}</h2>
              <p className="text-sm text-gray-600">{meal.calories} calories • {meal.servings} serving(s)</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Image */}
          {detailedMeal?.image_url && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={detailedMeal.image_url} 
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Nutrition & Time Info */}
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

          {/* Generate Recipe Button - Only show if we have meal ID */}
          {!hasDetailedRecipe && meal.id && (
            <Card className="p-6 text-center bg-gradient-to-r from-fitness-primary/10 to-pink-100">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Sparkles className="w-12 h-12 text-fitness-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Get Detailed Recipe with AI
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Generate detailed ingredients, step-by-step instructions, and professional food images
                  </p>
                  <Badge variant="outline" className="mb-4">
                    Daily limit: 10 recipes per day
                  </Badge>
                </div>
                <Button
                  onClick={handleGenerateRecipe}
                  disabled={isGeneratingRecipe}
                  className="bg-fitness-gradient hover:opacity-90 text-white px-6 py-3"
                >
                  {isGeneratingRecipe ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Detailed Recipe
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Show message if no meal ID available */}
          {!hasDetailedRecipe && !meal.id && (
            <Card className="p-6 text-center bg-gray-50">
              <p className="text-gray-600">
                Recipe generation not available for this meal. Please regenerate your meal plan to enable detailed recipes.
              </p>
            </Card>
          )}

          {/* Detailed Recipe Content */}
          {hasDetailedRecipe && (
            <>
              {/* Ingredients */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl mr-2">🥘</span>
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detailedMeal.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-fitness-primary font-semibold">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Instructions */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl mr-2">👨‍🍳</span>
                  Instructions
                </h3>
                <div className="space-y-4">
                  {detailedMeal.instructions.map((instruction: string, index: number) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-fitness-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  onClick={openYouTubeSearch}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch on YouTube</span>
                </Button>
                
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
