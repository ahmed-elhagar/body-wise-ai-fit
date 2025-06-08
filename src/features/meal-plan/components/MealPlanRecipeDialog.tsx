import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, Sparkles, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  meal: DailyMeal | null;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecipe = async () => {
    if (!meal || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          mealId: meal.id,
          mealName: meal.name,
          ingredients: meal.ingredients,
          servings: meal.servings
        }
      });

      if (error) throw error;

      toast.success('Recipe generated successfully!');
      onRecipeGenerated?.();
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Failed to generate recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1E1F23] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#FF6F3C]" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Meal Info */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#FF6F3C] text-white">
                <Clock className="w-3 h-3 mr-1" />
                {(meal.prep_time || 0) + (meal.cook_time || 0)} min
              </Badge>
              <Badge className="bg-blue-600 text-white">
                <Users className="w-3 h-3 mr-1" />
                {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
              </Badge>
              <Badge className="bg-green-600 text-white">
                {meal.calories} cal
              </Badge>
            </div>

            {/* Nutrition */}
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Nutrition per serving</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-[#FF6F3C] font-bold">{meal.calories}</p>
                    <p className="text-gray-400 text-xs">Calories</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-bold">{meal.protein}g</p>
                    <p className="text-gray-400 text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-bold">{meal.carbs}g</p>
                    <p className="text-gray-400 text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-bold">{meal.fat}g</p>
                    <p className="text-gray-400 text-xs">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {meal.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between text-gray-300">
                        <span>{ingredient.name}</span>
                        <span className="text-gray-400">{ingredient.quantity} {ingredient.unit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {meal.instructions && meal.instructions.length > 0 && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Instructions</h3>
                  <ol className="space-y-2">
                    {meal.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3 text-gray-300">
                        <span className="bg-[#FF6F3C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Detailed Recipe'}
              </Button>
              
              {meal.youtube_search_term && (
                <Button
                  onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(meal.youtube_search_term)}`, '_blank')}
                  variant="outline"
                  className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Tutorial
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
