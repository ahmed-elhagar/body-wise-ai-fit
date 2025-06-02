
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Sparkles, Youtube, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RecipeNutritionCard } from "./recipe/RecipeNutritionCard";
import { RecipeDetailsCard } from "./recipe/RecipeDetailsCard";
import type { DailyMeal } from "@/features/meal-plan/types";

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeUpdated?: () => void;
}

export const EnhancedRecipeDialog = ({ 
  isOpen, 
  onClose, 
  meal, 
  onRecipeUpdated 
}: EnhancedRecipeDialogProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  if (!meal) return null;

  const handleGenerateRecipe = async () => {
    if (!user || !meal) return;

    setIsGenerating(true);
    
    try {
      // Step 1: Analyzing ingredients
      setGenerationStep('analyzing');
      console.log('🔍 Step 1: Analyzing ingredients and nutrition...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Finding perfect recipe
      setGenerationStep('finding');
      console.log('📚 Step 2: Finding perfect recipe...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: Generating instructions
      setGenerationStep('generating');
      console.log('📝 Step 3: Generating cooking instructions...');
      
      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          meal: {
            id: meal.id,
            name: meal.name,
            meal_type: meal.meal_type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            ingredients: meal.ingredients,
            servings: meal.servings
          },
          userId: user.id,
          enhance: true
        }
      });

      if (error) {
        console.error('❌ Recipe generation error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Recipe generated successfully!', data);
        toast.success('Recipe generated successfully!');
        
        if (onRecipeUpdated) {
          onRecipeUpdated();
        }
      } else {
        console.error('❌ Recipe generation failed:', data);
        throw new Error(data?.error || 'Failed to generate recipe');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating recipe:', error);
      toast.error(error.message || 'Failed to generate recipe');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleGenerateImage = async () => {
    if (!user || !meal) return;

    try {
      toast.loading('Generating meal image...', { duration: 10000 });

      const { data, error } = await supabase.functions.invoke('generate-meal-image', {
        body: {
          mealId: meal.id,
          mealName: meal.name,
          ingredients: meal.ingredients.map(ing => ing.name).join(', '),
          userId: user.id
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Image generation error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Image generated successfully!');
        toast.success('Meal image generated!');
        
        if (onRecipeUpdated) {
          onRecipeUpdated();
        }
      } else {
        throw new Error(data?.error || 'Failed to generate image');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating image:', error);
      toast.error(error.message || 'Failed to generate image');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="w-6 h-6" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Image */}
          {meal.image_url && (
            <div className="relative">
              <img 
                src={meal.image_url} 
                alt={meal.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Meal Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecipeNutritionCard meal={meal} />
            <RecipeDetailsCard meal={meal} />
          </div>

          {/* Ingredients */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ingredients</h3>
              {meal.ingredients && meal.ingredients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{ingredient.name}</span>
                      <span className="text-sm text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No ingredients available</p>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Cooking Instructions</h3>
              {meal.instructions && meal.instructions.length > 0 ? (
                <ol className="space-y-2">
                  {meal.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No cooking instructions available</p>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGenerating}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating Recipe...' : 'Generate AI Recipe'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {!meal.image_url && (
              <Button
                onClick={handleGenerateImage}
                variant="outline"
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Generate Image
              </Button>
            )}
            
            {meal.youtube_search_term && (
              <Button
                onClick={() => {
                  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(meal.youtube_search_term)}`;
                  window.open(searchUrl, '_blank');
                }}
                variant="outline"
                className="flex-1"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Watch Video
              </Button>
            )}
            
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-blue-800">
                      {generationStep === 'analyzing' && 'Analyzing ingredients and nutrition...'}
                      {generationStep === 'finding' && 'Finding perfect recipe...'}
                      {generationStep === 'generating' && 'Generating cooking instructions...'}
                    </p>
                    <p className="text-sm text-blue-600">This may take a few moments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
