
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, ChefHat, Sparkles, Youtube, X } from "lucide-react";
import { useEnhancedMealRecipe } from "@/hooks/useEnhancedMealRecipe";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeGenerated?: () => void;
}

const EnhancedRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: EnhancedRecipeDialogProps) => {
  const { generateEnhancedRecipe, generateYouTubeSearchTerm, isGeneratingRecipe } = useEnhancedMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  useEffect(() => {
    if (isOpen && meal) {
      if (meal.ingredients?.length > 0 && meal.instructions?.length > 0) {
        setDetailedMeal(meal);
      } else {
        setDetailedMeal(null);
      }
    }
  }, [isOpen, meal]);

  const handleGenerateRecipe = async () => {
    if (!meal?.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    const result = await generateEnhancedRecipe(meal.id, meal);
    if (result) {
      console.log('✅ Enhanced recipe generated, updating detailed meal:', result);
      setDetailedMeal(result);
      
      if (onRecipeGenerated) {
        onRecipeGenerated();
      }
    }
  };

  const openYouTubeSearch = () => {
    const searchTerm = detailedMeal?.youtube_search_term || 
                      generateYouTubeSearchTerm(meal?.name || '');
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  if (!meal) return null;

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-white border-gray-200 p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  {meal.name}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-fitness-primary-100 text-fitness-primary-700">
                    <Clock className="w-3 h-3 mr-1" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Users className="w-3 h-3 mr-1" />
                    {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700">
                    {meal.calories} cal
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Nutrition Grid */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Nutrition per serving</h3>
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

            {/* Enhanced Recipe Generation */}
            {!hasDetailedRecipe && (
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 mb-2">Generate Detailed Recipe</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get step-by-step instructions, cooking tips, and enhanced ingredient details.
                  </p>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGeneratingRecipe}
                    className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingRecipe ? 'Generating Recipe...' : 'Generate Enhanced Recipe'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {hasDetailedRecipe && detailedMeal?.ingredients?.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {detailedMeal.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{ingredient.name}</span>
                        <span className="text-gray-500 text-sm">{ingredient.quantity} {ingredient.unit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {hasDetailedRecipe && detailedMeal?.instructions?.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Instructions</h3>
                  <div className="space-y-3">
                    {detailedMeal.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-fitness-primary-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions with enhanced functionality */}
        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <Button
              onClick={openYouTubeSearch}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Watch Tutorial
            </Button>
            
            {!hasDetailedRecipe && (
              <Button
                onClick={handleGenerateRecipe}
                disabled={isGeneratingRecipe}
                className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGeneratingRecipe ? 'Generating...' : 'Generate Detailed Recipe'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRecipeDialog;
