
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, Users, ChefHat, Sparkles, Youtube, Flame } from "lucide-react";
import { useMealRecipe } from "@/hooks/useMealRecipe";
import type { Meal } from "@/types/meal";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;

  const handleGenerateRecipe = async () => {
    if (!meal.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    const result = await generateRecipe(meal.id);
    if (result) {
      console.log('✅ Recipe generated, updating detailed meal:', result);
      setDetailedMeal(result);
      
      if (onRecipeGenerated) {
        onRecipeGenerated();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="relative p-6 pb-0">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-fitness-orange-500 to-fitness-orange-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-800 mb-1">
                  {meal.name}
                </DialogTitle>
                <div className="flex gap-3">
                  <Badge className="bg-fitness-orange-100 text-fitness-orange-700 border-fitness-orange-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {((meal.prepTime || 0) + (meal.cookTime || 0)) || 20} min
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <Users className="w-3 h-3 mr-1" />
                    {meal.servings || 1} serving
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Flame className="w-3 h-3 mr-1" />
                    {meal.calories} cal
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 pt-0 space-y-6">
            {/* Nutrition Card */}
            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Nutrition per serving</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-fitness-orange-600">{meal.calories}</p>
                    <p className="text-gray-600 text-sm">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{meal.protein}g</p>
                    <p className="text-gray-600 text-sm">Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{meal.carbs}g</p>
                    <p className="text-gray-600 text-sm">Carbs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{meal.fat}g</p>
                    <p className="text-gray-600 text-sm">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Recipe Section */}
            {!hasDetailedRecipe && (
              <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border border-fitness-primary-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-fitness-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">
                    Generate Detailed Recipe
                  </h3>
                  <p className="text-fitness-primary-600 mb-4">
                    Get step-by-step instructions and ingredient details
                  </p>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGeneratingRecipe}
                    className="bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 hover:from-fitness-orange-600 hover:to-fitness-orange-700 text-white px-8 py-2 rounded-xl font-semibold shadow-lg"
                  >
                    {isGeneratingRecipe ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Detailed Recipe
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {hasDetailedRecipe && detailedMeal?.ingredients?.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    Ingredients
                  </h3>
                  <div className="space-y-2">
                    {detailedMeal.ingredients.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        <span className="text-green-600 font-semibold">{ingredient.quantity} {ingredient.unit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {hasDetailedRecipe && detailedMeal?.instructions?.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    Instructions
                  </h3>
                  <div className="space-y-3">
                    {detailedMeal.instructions.map((instruction: string, index: number) => (
                      <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-0.5">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {hasDetailedRecipe && (
              <div className="flex gap-3">
                <Button
                  onClick={openYouTubeSearch}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Tutorial
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
