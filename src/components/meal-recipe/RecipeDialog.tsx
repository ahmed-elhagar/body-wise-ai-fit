
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, ChefHat, Sparkles, Youtube } from "lucide-react";
import { useEnhancedMealRecipe } from "@/hooks/useEnhancedMealRecipe";
import type { Meal } from "@/types/meal";

interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const RecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: RecipeDialogProps) => {
  const { generateEnhancedRecipe, generateYouTubeSearchTerm, isGeneratingRecipe } = useEnhancedMealRecipe();
  const [currentMeal, setCurrentMeal] = useState<Meal>(meal);

  // Update current meal when prop changes
  React.useEffect(() => {
    setCurrentMeal(meal);
  }, [meal]);

  const handleGenerateRecipe = async () => {
    if (!currentMeal.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    console.log('🍳 Generating recipe for meal:', currentMeal.name, 'ID:', currentMeal.id);
    
    const result = await generateEnhancedRecipe(currentMeal.id, currentMeal);
    if (result) {
      console.log('✅ Recipe generated successfully, updating meal data');
      
      // Update the current meal with the new recipe data
      const updatedMeal = {
        ...currentMeal,
        ingredients: result.ingredients || currentMeal.ingredients,
        instructions: result.instructions || currentMeal.instructions,
        youtube_search_term: result.youtube_search_term || currentMeal.youtube_search_term,
        image_url: result.image_url || currentMeal.image_url
      };
      
      setCurrentMeal(updatedMeal);
      
      if (onRecipeGenerated) {
        onRecipeGenerated();
      }
    }
  };

  const openYouTubeSearch = () => {
    const searchTerm = currentMeal.youtube_search_term || generateYouTubeSearchTerm(currentMeal.name);
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`, '_blank');
  };

  const hasDetailedRecipe = currentMeal.ingredients && currentMeal.ingredients.length > 0 && 
                           currentMeal.instructions && currentMeal.instructions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {currentMeal.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Meal Info */}
            <div className="flex flex-wrap gap-3">
              <Badge>
                <Clock className="w-3 h-3 mr-1" />
                {(currentMeal.prepTime || 0) + (currentMeal.cookTime || 0)} min
              </Badge>
              <Badge>
                <Users className="w-3 h-3 mr-1" />
                {currentMeal.servings} serving{currentMeal.servings !== 1 ? 's' : ''}
              </Badge>
              <Badge>
                {currentMeal.calories} cal
              </Badge>
            </div>

            {/* Nutrition */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Nutrition per serving</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="font-bold text-red-600">{currentMeal.calories}</p>
                    <p className="text-gray-500 text-xs">Calories</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">{currentMeal.protein}g</p>
                    <p className="text-gray-500 text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600">{currentMeal.carbs}g</p>
                    <p className="text-gray-500 text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="font-bold text-yellow-600">{currentMeal.fat}g</p>
                    <p className="text-gray-500 text-xs">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Generation Prompt */}
            {!hasDetailedRecipe && (
              <Card>
                <CardContent className="p-4 text-center">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 mb-2">Generate Detailed Recipe</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get step-by-step cooking instructions, ingredient details, and cooking tips powered by AI.
                  </p>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGeneratingRecipe}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingRecipe ? 'Generating Recipe...' : 'Generate Detailed Recipe'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {hasDetailedRecipe && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {currentMeal.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{typeof ingredient === 'string' ? ingredient : ingredient.name}</span>
                        {typeof ingredient === 'object' && (
                          <span className="text-gray-500">{ingredient.quantity} {ingredient.unit}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {hasDetailedRecipe && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-2">
                    {currentMeal.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Generated Recipe Image */}
            {currentMeal.image_url && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Recipe Image</h3>
                  <img 
                    src={currentMeal.image_url} 
                    alt={currentMeal.name}
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      console.error('Failed to load recipe image:', currentMeal.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!hasDetailedRecipe ? (
                <Button
                  onClick={handleGenerateRecipe}
                  disabled={isGeneratingRecipe}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingRecipe ? 'Generating...' : 'Generate Detailed Recipe'}
                </Button>
              ) : (
                <Button
                  onClick={openYouTubeSearch}
                  variant="outline"
                  className="flex-1"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Watch Tutorial
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
