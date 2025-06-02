
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Clock, Users, Sparkles, Youtube, ExternalLink } from "lucide-react";
import { useEnhancedMealRecipe } from "@/hooks/useEnhancedMealRecipe";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeGenerated?: () => void;
}

const EnhancedRecipeDialog = ({ 
  isOpen, 
  onClose, 
  meal, 
  onRecipeGenerated 
}: EnhancedRecipeDialogProps) => {
  const { generateEnhancedRecipe, generateYouTubeSearchTerm, isGeneratingRecipe } = useEnhancedMealRecipe();
  const [recipeData, setRecipeData] = useState<DailyMeal | null>(null);

  useEffect(() => {
    if (meal) {
      setRecipeData(meal);
    }
  }, [meal]);

  if (!meal) return null;

  const handleGenerateRecipe = async () => {
    if (!meal.id) return;
    
    const updatedMeal = await generateEnhancedRecipe(meal.id, meal);
    if (updatedMeal) {
      // Convert the database response to match our DailyMeal type
      const typedMeal: DailyMeal = {
        ...updatedMeal,
        ingredients: Array.isArray(updatedMeal.ingredients) 
          ? updatedMeal.ingredients 
          : typeof updatedMeal.ingredients === 'string' 
            ? JSON.parse(updatedMeal.ingredients)
            : [],
        instructions: Array.isArray(updatedMeal.instructions)
          ? updatedMeal.instructions
          : [],
        alternatives: Array.isArray(updatedMeal.alternatives)
          ? updatedMeal.alternatives
          : typeof updatedMeal.alternatives === 'string'
            ? JSON.parse(updatedMeal.alternatives)
            : []
      };
      setRecipeData(typedMeal);
      onRecipeGenerated?.();
    }
  };

  const handleYouTubeSearch = () => {
    const searchTerm = recipeData?.youtube_search_term || generateYouTubeSearchTerm(meal.name);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  const hasDetailedRecipe = recipeData?.ingredients && 
    Array.isArray(recipeData.ingredients) && 
    recipeData.ingredients.length > 0 &&
    recipeData.instructions && 
    Array.isArray(recipeData.instructions) && 
    recipeData.instructions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {recipeData?.name || meal.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Meal Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meal Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{meal.calories}</div>
                    <div className="text-sm text-orange-600">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{meal.protein}g</div>
                    <div className="text-sm text-green-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{meal.carbs}g</div>
                    <div className="text-sm text-blue-600">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{meal.fat}g</div>
                    <div className="text-sm text-yellow-600">Fat</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min total
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300">
                    <Users className="w-3 h-3 mr-1" />
                    {meal.servings || 1} serving{(meal.servings || 1) !== 1 ? 's' : ''}
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 capitalize">
                    {meal.meal_type}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Generation */}
            {!hasDetailedRecipe && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-6 text-center">
                  <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Generate Detailed Recipe</h3>
                  <p className="text-gray-600 mb-4">
                    Get step-by-step cooking instructions, detailed ingredients list, and cooking tips
                  </p>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGeneratingRecipe}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingRecipe ? 'Generating Recipe...' : 'Generate Recipe with AI'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Detailed Recipe */}
            {hasDetailedRecipe && (
              <>
                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recipeData.ingredients.map((ingredient: any, index: number) => {
                        const ingredientName = ingredient.name || ingredient;
                        const quantity = ingredient.quantity || '';
                        const unit = ingredient.unit || '';
                        
                        return (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-fitness-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                            <div className="flex-1">
                              <span className="font-medium">{quantity} {unit}</span>
                              <span className="ml-2">{ingredientName}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cooking Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recipeData.instructions.map((instruction: string, index: number) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-fitness-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800">{instruction}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Video Tutorial */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  Video Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Watch cooking videos on YouTube for visual guidance
                </p>
                <Button
                  onClick={handleYouTubeSearch}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Search on YouTube
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {!hasDetailedRecipe && (
            <Button
              onClick={handleGenerateRecipe}
              disabled={isGeneratingRecipe}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingRecipe ? 'Generating...' : 'Generate Recipe'}
            </Button>
          )}
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRecipeDialog;
