
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Users, 
  ChefHat, 
  Sparkles, 
  BookOpen, 
  Utensils,
  Timer,
  ArrowRight,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
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
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const handleGenerateRecipe = async () => {
    if (!meal || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: {
          mealName: meal.name,
          servings: meal.servings,
          targetCalories: meal.calories,
          prepTime: meal.prep_time,
          cookTime: meal.cook_time,
          ingredients: meal.ingredients,
          mealType: meal.meal_type
        }
      });

      if (error) throw error;

      setGeneratedRecipe(data);
      onRecipeGenerated?.();
      toast.success('Recipe generated successfully! 🍳');
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Failed to generate recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!meal) return null;

  const recipe = generatedRecipe || {
    instructions: meal.instructions || [],
    ingredients: meal.ingredients || []
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <ChefHat className="w-7 h-7" />
                  {meal.name}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-white/20 text-white px-3 py-1">
                    <Utensils className="w-3 h-3 mr-1" />
                    {meal.meal_type}
                  </Badge>
                  <Badge className="bg-white/20 text-white px-3 py-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                  </Badge>
                  <Badge className="bg-white/20 text-white px-3 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              
              {!generatedRecipe && (
                <Button
                  onClick={handleGenerateRecipe}
                  disabled={isGenerating}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 ml-4"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Recipe'}
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Nutrition Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">{meal.calories}</div>
                    <div className="text-sm text-red-600">Calories</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{meal.protein}g</div>
                    <div className="text-sm text-blue-600">Protein</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{meal.carbs}g</div>
                    <div className="text-sm text-green-600">Carbs</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-700">{meal.fat}g</div>
                    <div className="text-sm text-orange-600">Fat</div>
                  </CardContent>
                </Card>
              </div>

              {/* Timing Information */}
              {(meal.prep_time || meal.cook_time) && (
                <Card className="bg-white border-fitness-primary-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-fitness-primary-700 mb-3 flex items-center gap-2">
                      <Timer className="w-5 h-5" />
                      Timing
                    </h3>
                    <div className="flex items-center gap-6">
                      {meal.prep_time && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-fitness-primary-100 rounded-lg flex items-center justify-center">
                            <ChefHat className="w-4 h-4 text-fitness-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-fitness-primary-700">Prep Time</div>
                            <div className="text-lg font-bold text-fitness-primary-600">{meal.prep_time} min</div>
                          </div>
                        </div>
                      )}
                      
                      {meal.cook_time && (
                        <>
                          {meal.prep_time && <ArrowRight className="w-4 h-4 text-gray-400" />}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Timer className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-orange-700">Cook Time</div>
                              <div className="text-lg font-bold text-orange-600">{meal.cook_time} min</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Card className="bg-white border-fitness-primary-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-fitness-primary-700 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Ingredients ({recipe.ingredients.length} items)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recipe.ingredients.map((ingredient: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-fitness-primary-25 rounded-lg border border-fitness-primary-100">
                          <div className="w-2 h-2 bg-fitness-primary-400 rounded-full flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-fitness-primary-700">{ingredient.name}</div>
                            <div className="text-sm text-fitness-primary-600">
                              {ingredient.quantity} {ingredient.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <Card className="bg-white border-fitness-primary-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-fitness-primary-700 mb-4 flex items-center gap-2">
                      <Utensils className="w-5 h-5" />
                      Instructions ({recipe.instructions.length} steps)
                    </h3>
                    <div className="space-y-4">
                      {recipe.instructions.map((instruction: string, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-fitness-primary-700 leading-relaxed">{instruction}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Generation Prompt */}
              {!generatedRecipe && (
                <Card className="bg-gradient-to-r from-fitness-accent-50 to-fitness-primary-50 border-fitness-accent-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fitness-accent-500 to-fitness-primary-500 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">
                      Generate Detailed Recipe
                    </h3>
                    <p className="text-fitness-primary-600 mb-4 max-w-md mx-auto">
                      Let AI create a detailed recipe with step-by-step instructions tailored to your meal.
                    </p>
                    <Button
                      onClick={handleGenerateRecipe}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-fitness-accent-500 to-fitness-primary-500 hover:from-fitness-accent-600 hover:to-fitness-primary-600 text-white shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating Recipe...' : 'Generate Recipe with AI'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRecipeDialog;
