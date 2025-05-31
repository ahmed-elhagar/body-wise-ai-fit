
import { useState } from "react";
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

  const handleGenerateRecipe = async () => {
    if (!meal.id) return;
    
    const updatedMeal = await generateEnhancedRecipe(meal.id, meal);
    if (updatedMeal && onRecipeGenerated) {
      onRecipeGenerated();
    }
  };

  const openYouTubeSearch = () => {
    const searchTerm = generateYouTubeSearchTerm(meal.name);
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Meal Info */}
            <div className="flex flex-wrap gap-3">
              <Badge>
                <Clock className="w-3 h-3 mr-1" />
                {(meal.prepTime || 0) + (meal.cookTime || 0)} min
              </Badge>
              <Badge>
                <Users className="w-3 h-3 mr-1" />
                {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
              </Badge>
              <Badge>
                {meal.calories} cal
              </Badge>
            </div>

            {/* Nutrition */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Nutrition per serving</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="font-bold text-red-600">{meal.calories}</p>
                    <p className="text-gray-500 text-xs">Calories</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">{meal.protein}g</p>
                    <p className="text-gray-500 text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600">{meal.carbs}g</p>
                    <p className="text-gray-500 text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="font-bold text-yellow-600">{meal.fat}g</p>
                    <p className="text-gray-500 text-xs">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {meal.ingredients.map((ingredient, index) => (
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
            {meal.instructions && meal.instructions.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-2">
                    {meal.instructions.map((instruction, index) => (
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

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateRecipe}
                disabled={isGeneratingRecipe}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGeneratingRecipe ? 'Generating...' : 'Generate Detailed Recipe'}
              </Button>
              
              <Button
                onClick={openYouTubeSearch}
                variant="outline"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Tutorial
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
