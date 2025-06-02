
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Utensils } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import type { DailyMeal } from '../../types';

interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
}

export const RecipeDialog = ({ isOpen, onClose, meal }: RecipeDialogProps) => {
  const { recipe } = useMealPlanTranslations();

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Meal Image */}
          {meal.image_url && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={meal.image_url} 
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{meal.prep_time + meal.cook_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{meal.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4" />
              <span className="capitalize">{meal.meal_type}</span>
            </div>
            {meal.difficulty && (
              <Badge variant="outline" className="capitalize">
                {meal.difficulty}
              </Badge>
            )}
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{meal.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{meal.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{meal.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{meal.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>

          {/* Description */}
          {meal.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{meal.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Ingredients</h3>
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
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && meal.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ol className="space-y-2">
                {meal.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {meal.tips && (
            <div>
              <h3 className="font-semibold mb-2">Tips</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{meal.tips}</p>
            </div>
          )}

          {/* Nutrition Benefits */}
          {meal.nutrition_benefits && (
            <div>
              <h3 className="font-semibold mb-2">Nutrition Benefits</h3>
              <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{meal.nutrition_benefits}</p>
            </div>
          )}
          
          <Button onClick={onClose} className="w-full">
            Close {recipe}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
