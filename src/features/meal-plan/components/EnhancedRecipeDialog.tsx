import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Utensils, Youtube, ExternalLink, Sparkles, ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useMealRecipe } from '../hooks';
import { toast } from 'sonner';
import type { DailyMeal } from '@/features/meal-plan/types';

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onRecipeUpdated?: () => void;
}

export const EnhancedRecipeDialog = ({ isOpen, onClose, meal, onRecipeUpdated }: EnhancedRecipeDialogProps) => {
  const { t, isRTL } = useLanguage();
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [currentMeal, setCurrentMeal] = useState<DailyMeal | null>(meal);

  useEffect(() => {
    setCurrentMeal(meal);
  }, [meal]);

  const handleGenerateFullRecipe = async () => {
    if (!currentMeal?.id) return;

    try {
      console.log('🍳 Generating full recipe with image for meal:', currentMeal.id);
      
      const updatedMeal = await generateRecipe(currentMeal.id);
      
      if (updatedMeal) {
        // Convert the updated meal data to our DailyMeal type
        const convertedMeal: DailyMeal = {
          ...currentMeal,
          ingredients: Array.isArray(updatedMeal.ingredients) 
            ? updatedMeal.ingredients 
            : typeof updatedMeal.ingredients === 'string'
              ? JSON.parse(updatedMeal.ingredients)
              : [],
          instructions: Array.isArray(updatedMeal.instructions)
            ? updatedMeal.instructions
            : typeof updatedMeal.instructions === 'string'
              ? JSON.parse(updatedMeal.instructions)
              : [],
          alternatives: Array.isArray(updatedMeal.alternatives)
            ? updatedMeal.alternatives
            : typeof updatedMeal.alternatives === 'string'
              ? JSON.parse(updatedMeal.alternatives)
              : [],
          youtube_search_term: updatedMeal.youtube_search_term || currentMeal.youtube_search_term,
          image_url: updatedMeal.image_url || currentMeal.image_url,
          recipe_fetched: true
        };
        
        setCurrentMeal(convertedMeal);
        onRecipeUpdated?.();
        toast.success('Recipe with image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      // Don't show additional error toast since useMealRecipe already handles it
    }
  };

  const handleYouTubeSearch = () => {
    if (!currentMeal) return;
    
    const searchTerm = currentMeal.youtube_search_term || `${currentMeal.name} recipe tutorial`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  if (!currentMeal) return null;

  const hasFullRecipe = currentMeal.ingredients && 
                       Array.isArray(currentMeal.ingredients) && 
                       currentMeal.ingredients.length > 0 && 
                       currentMeal.instructions && 
                       Array.isArray(currentMeal.instructions) && 
                       currentMeal.instructions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ChefHat className="w-5 h-5" />
            {currentMeal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Meal Image */}
          <div className="relative">
            {currentMeal.image_url ? (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={currentMeal.image_url} 
                  alt={currentMeal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className={`flex flex-wrap gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-4 h-4" />
              <span>{(currentMeal.prep_time || 0) + (currentMeal.cook_time || 0)} min</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="w-4 h-4" />
              <span>{currentMeal.servings} servings</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Utensils className="w-4 h-4" />
              <span className="capitalize">{currentMeal.meal_type}</span>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{currentMeal.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentMeal.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentMeal.carbs || 0}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentMeal.fat || 0}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>

          {/* Generate Full Recipe Button */}
          {!hasFullRecipe && (
            <div className="text-center py-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold mb-2 text-purple-800">Generate Complete Recipe</h3>
              <p className="text-sm text-purple-600 mb-4">
                Get detailed ingredients, step-by-step instructions, and food image with AI
              </p>
              <Button
                onClick={handleGenerateFullRecipe}
                disabled={isGeneratingRecipe}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGeneratingRecipe ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Recipe & Image...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Complete Recipe
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Ingredients */}
          {hasFullRecipe && currentMeal.ingredients && currentMeal.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentMeal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{ingredient.name}</span>
                    <span className="text-sm text-gray-600">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {hasFullRecipe && currentMeal.instructions && currentMeal.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ol className="space-y-2">
                {currentMeal.instructions.map((instruction, index) => (
                  <li key={index} className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Alternatives */}
          {hasFullRecipe && currentMeal.alternatives && currentMeal.alternatives.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Alternative Ingredients</h3>
              <div className="space-y-2">
                {currentMeal.alternatives.map((alternative, index) => (
                  <div key={index} className="p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                    <span className="text-blue-800">{alternative}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleYouTubeSearch}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Watch Tutorial
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <Button onClick={onClose} className="flex-1">
              Close Recipe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
