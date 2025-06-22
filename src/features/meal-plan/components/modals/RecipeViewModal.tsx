import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChefHat, 
  Clock, 
  Users, 
  Flame, 
  Zap, 
  Loader2, 
  X,
  Sparkles
} from 'lucide-react';
import { useMealRecipe } from '../../hooks/useMealRecipe';
import type { DailyMeal } from '../../types';
import { toast } from 'sonner';

interface RecipeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeGenerated?: () => void;
}

export const RecipeViewModal: React.FC<RecipeViewModalProps> = ({
  isOpen,
  onClose,
  meal,
  onRecipeGenerated
}) => {
  const { generateRecipe, useExistingRecipe, isGeneratingRecipe } = useMealRecipe();
  const [enhancedMeal, setEnhancedMeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipeOptions, setShowRecipeOptions] = useState<any>(null);

  useEffect(() => {
    if (isOpen && meal) {
      // Reset states
      setShowRecipeOptions(null);
      setEnhancedMeal(null);
      
      // Check if meal already has detailed recipe
      if (meal.recipe_fetched && 
          meal.instructions && 
          Array.isArray(meal.instructions) && 
          meal.instructions.length > 1 && 
          meal.ingredients &&
          Array.isArray(meal.ingredients) &&
          meal.ingredients.length > 0) {
        setEnhancedMeal(meal);
      } else {
        // Try to find existing recipes first
        handleGenerateRecipe();
      }
    }
  }, [isOpen, meal]);

  const handleGenerateRecipe = async (forceGenerate: boolean = false) => {
    if (!meal?.id) return;

    setIsLoading(true);
    try {
      const result = await generateRecipe(meal.id, forceGenerate);
      if (result) {
        if (result.hasExistingRecipes) {
          // Show options to user
          setShowRecipeOptions(result);
        } else {
          // Direct recipe result
          setEnhancedMeal(result);
          onRecipeGenerated?.();
        }
      }
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      toast.error('Failed to generate recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExistingRecipe = async (existingRecipe: any) => {
    if (!meal?.id) return;

    setIsLoading(true);
    try {
      const result = await useExistingRecipe(meal.id, existingRecipe);
      if (result) {
        setEnhancedMeal(result);
        setShowRecipeOptions(null);
        onRecipeGenerated?.();
      }
    } catch (error) {
      console.error('Failed to use existing recipe:', error);
      toast.error('Failed to copy recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNewRecipe = () => {
    setShowRecipeOptions(null);
    handleGenerateRecipe(true); // Force generate new recipe
  };

  const handleClose = () => {
    setEnhancedMeal(null);
    onClose();
  };

  if (!meal) return null;

  const displayMeal = enhancedMeal || meal;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{displayMeal.name}</DialogTitle>
                <DialogDescription>
                  Detailed recipe and cooking instructions
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading || isGeneratingRecipe ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {showRecipeOptions ? 'Processing Recipe Choice...' : 'Searching for Recipes...'}
            </h3>
            <p className="text-gray-600 text-center">
              {showRecipeOptions 
                ? 'Applying your selected recipe...'
                : 'Checking database for existing recipes and generating if needed...'
              }
            </p>
          </div>
        ) : showRecipeOptions ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Recipe Options Available</h3>
              <p className="text-gray-600 mb-6">
                Found {showRecipeOptions.existingRecipes.length} similar recipe(s) in our database. 
                Choose to use an existing recipe (free) or generate a new one with AI.
              </p>
            </div>

            {/* Existing Recipes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 flex items-center">
                <Badge className="bg-green-100 text-green-800 mr-2">FREE</Badge>
                Use Existing Recipe
              </h4>
              {showRecipeOptions.existingRecipes.map((recipe: any, index: number) => (
                <Card key={index} className="p-4 border-green-200 hover:border-green-300 cursor-pointer transition-colors"
                      onClick={() => handleUseExistingRecipe(recipe)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{recipe.name}</h5>
                      <p className="text-sm text-gray-600">
                        {recipe.calories} kcal • {recipe.prep_time + recipe.cook_time} min • 
                        {recipe.ingredients?.length || 0} ingredients
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                      Use This Recipe
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Generate New Recipe */}
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700 flex items-center">
                <Badge className="bg-blue-100 text-blue-800 mr-2">AI CREDITS</Badge>
                Generate New Recipe
              </h4>
              <Card className="p-4 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Create Custom Recipe with AI</h5>
                    <p className="text-sm text-gray-600">
                      Generate a detailed, personalized recipe tailored to your preferences
                    </p>
                  </div>
                  <Button onClick={handleGenerateNewRecipe} 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate New
                  </Button>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Nutrition Overview */}
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Flame className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-semibold">{displayMeal.calories || 0}</span>
                  </div>
                  <p className="text-xs text-gray-600">Calories</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-semibold">{displayMeal.protein || 0}g</span>
                  </div>
                  <p className="text-xs text-gray-600">Protein</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="font-semibold">
                      {(displayMeal.prep_time || 0) + (displayMeal.cook_time || 0)}m
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Total Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="font-semibold">{displayMeal.servings || 1}</span>
                  </div>
                  <p className="text-xs text-gray-600">Servings</p>
                </div>
              </div>
            </Card>

            {/* Macronutrients */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Protein: {displayMeal.protein || 0}g
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Carbs: {displayMeal.carbs || 0}g
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Fat: {displayMeal.fat || 0}g
              </Badge>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-500" />
                Ingredients
              </h3>
              <div className="grid gap-2">
                {displayMeal.ingredients && Array.isArray(displayMeal.ingredients) ? (
                  displayMeal.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium mr-2">
                        {ingredient.quantity || '1'} {ingredient.unit || 'piece'}
                      </span>
                      <span>{ingredient.name || ingredient}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic">No detailed ingredients available</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-blue-500" />
                Instructions
              </h3>
              <div className="space-y-3">
                {displayMeal.instructions && Array.isArray(displayMeal.instructions) ? (
                  displayMeal.instructions.map((instruction: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800">{instruction}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No detailed instructions available</p>
                    <Button 
                      onClick={() => handleGenerateRecipe()}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Detailed Recipe
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {!enhancedMeal && (
                <Button 
                  onClick={() => handleGenerateRecipe()}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance Recipe
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 