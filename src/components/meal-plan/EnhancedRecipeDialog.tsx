
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Sparkles, Youtube, Camera, Clock, Users, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { DailyMeal } from "@/features/meal-plan/types";

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeUpdated?: () => void;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
}

const GENERATION_STEPS: GenerationStep[] = [
  { id: 'analyzing', title: 'Analyzing Ingredients', description: 'Processing nutritional information and flavor profiles...' },
  { id: 'recipe', title: 'Creating Recipe', description: 'Generating detailed cooking instructions...' },
  { id: 'image', title: 'Generating Image', description: 'Creating visual representation of the dish...' },
  { id: 'finalizing', title: 'Finalizing', description: 'Saving recipe and optimizing for your preferences...' }
];

export const EnhancedRecipeDialog = ({ 
  isOpen, 
  onClose, 
  meal, 
  onRecipeUpdated 
}: EnhancedRecipeDialogProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepProgress, setStepProgress] = useState(0);

  if (!meal) return null;

  const hasFullRecipe = meal.instructions && meal.instructions.length > 0 && 
                       meal.ingredients && meal.ingredients.length > 0;

  const handleGenerateFullRecipe = async () => {
    if (!user || !meal) return;

    setIsGenerating(true);
    
    try {
      // Step 1: Analyzing ingredients
      setCurrentStep('analyzing');
      setStepProgress(25);
      console.log('🔍 Step 1: Analyzing ingredients and nutrition...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Creating recipe
      setCurrentStep('recipe');
      setStepProgress(50);
      console.log('📚 Step 2: Creating detailed recipe...');
      
      const { data: recipeData, error: recipeError } = await supabase.functions.invoke('generate-meal-recipe', {
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
          enhance: true,
          generateImage: false // We'll do this separately
        }
      });

      if (recipeError) {
        console.error('❌ Recipe generation error:', recipeError);
        throw recipeError;
      }

      // Step 3: Generating image
      setCurrentStep('image');
      setStepProgress(75);
      console.log('🖼️ Step 3: Generating meal image...');

      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-meal-image', {
        body: {
          mealId: meal.id,
          mealName: meal.name,
          ingredients: meal.ingredients?.map((ing: any) => ing.name).join(', ') || '',
          userId: user.id,
          recipeInstructions: recipeData?.meal?.instructions
        }
      });

      // Step 4: Finalizing
      setCurrentStep('finalizing');
      setStepProgress(100);
      console.log('💾 Step 4: Finalizing and saving...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (recipeData?.success) {
        console.log('✅ Recipe and image generated successfully!');
        toast.success('Complete recipe with image generated successfully!');
        
        if (onRecipeUpdated) {
          onRecipeUpdated();
        }
      } else {
        console.error('❌ Recipe generation failed:', recipeData);
        toast.error(recipeData?.error || 'Failed to generate complete recipe');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating complete recipe:', error);
      toast.error(error.message || 'Failed to generate complete recipe');
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
      setStepProgress(0);
    }
  };

  const openYouTubeSearch = () => {
    const searchTerm = meal.youtube_search_term || `${meal.name} recipe cooking tutorial`;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="w-6 h-6 text-orange-500" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Image */}
          {meal.image_url && (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={meal.image_url} 
                alt={meal.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Meal Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Time</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                </p>
                <p className="text-sm text-gray-500">
                  Prep: {meal.prep_time || 0} | Cook: {meal.cook_time || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">Servings</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{meal.servings}</p>
                <p className="text-sm text-gray-500">servings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">Calories</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{meal.calories}</p>
                <p className="text-sm text-gray-500">per serving</p>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Nutrition Information</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{meal.protein}g</p>
                  <p className="text-sm text-gray-500">Protein</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{meal.carbs}g</p>
                  <p className="text-sm text-gray-500">Carbs</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-600">{meal.fat}g</p>
                  <p className="text-sm text-gray-500">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        {GENERATION_STEPS.find(step => step.id === currentStep)?.title || 'Processing...'}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {GENERATION_STEPS.find(step => step.id === currentStep)?.description || 'Please wait...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stepProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-blue-600">
                    {GENERATION_STEPS.map((step, index) => (
                      <span 
                        key={step.id}
                        className={stepProgress > (index * 25) ? 'font-semibold' : 'opacity-50'}
                      >
                        {step.title}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipe Generation or Display */}
          {!hasFullRecipe && !isGenerating && (
            <Card className="text-center">
              <CardContent className="p-6">
                <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Generate Complete Recipe</h3>
                <p className="text-gray-600 mb-6">
                  Get detailed cooking instructions, ingredient measurements, and a beautiful image of your dish.
                </p>
                <Button
                  onClick={handleGenerateFullRecipe}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Complete Recipe & Image
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          {hasFullRecipe && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Ingredients</h3>
                {meal.ingredients && meal.ingredients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {meal.ingredients.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{ingredient.name}</span>
                        <Badge variant="outline">
                          {ingredient.quantity} {ingredient.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Ingredients will appear here after recipe generation</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {hasFullRecipe && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Cooking Instructions</h3>
                {meal.instructions && meal.instructions.length > 0 ? (
                  <ol className="space-y-3">
                    {meal.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="flex gap-4">
                        <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="pt-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500 italic">Cooking instructions will appear here after recipe generation</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-4">
            {hasFullRecipe && meal.youtube_search_term && (
              <Button
                onClick={openYouTubeSearch}
                variant="outline"
                className="flex-1 max-w-xs"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Watch Tutorial
              </Button>
            )}
            
            <Button onClick={onClose} className="flex-1 max-w-xs">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
