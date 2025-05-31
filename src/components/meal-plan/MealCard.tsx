
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ChefHat, ArrowLeftRight } from "lucide-react";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealCardProps {
  meal: DailyMeal;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
}

const MealCard = ({ meal, onShowRecipe, onExchangeMeal }: MealCardProps) => {
  console.log('🍽️ MealCard rendered for:', meal.name, 'with handlers:', {
    hasShowRecipe: !!onShowRecipe,
    hasExchangeMeal: !!onExchangeMeal,
    onShowRecipeType: typeof onShowRecipe,
    onExchangeMealType: typeof onExchangeMeal
  });

  const handleViewRecipe = (e: React.MouseEvent) => {
    console.log('🔥 BUTTON CLICK DETECTED - VIEW RECIPE');
    console.log('🔥 Event details:', e.type, e.currentTarget);
    console.log('🔥 Meal:', meal.name, meal.id);
    console.log('🔥 onShowRecipe function:', typeof onShowRecipe, !!onShowRecipe);
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!onShowRecipe) {
      console.error('🔥 ❌ onShowRecipe is not defined!');
      return;
    }
    
    try {
      console.log('🔥 Calling onShowRecipe with meal:', meal);
      onShowRecipe(meal);
      console.log('🔥 ✅ onShowRecipe called successfully');
    } catch (error) {
      console.error('🔥 ❌ Error calling onShowRecipe:', error);
    }
  };

  const handleExchangeMeal = (e: React.MouseEvent) => {
    console.log('🔄 BUTTON CLICK DETECTED - EXCHANGE MEAL');
    console.log('🔄 Event details:', e.type, e.currentTarget);
    console.log('🔄 Meal:', meal.name, meal.id);
    console.log('🔄 onExchangeMeal function:', typeof onExchangeMeal, !!onExchangeMeal);
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!onExchangeMeal) {
      console.error('🔄 ❌ onExchangeMeal is not defined!');
      return;
    }
    
    try {
      console.log('🔄 Calling onExchangeMeal with meal:', meal);
      onExchangeMeal(meal);
      console.log('🔄 ✅ onExchangeMeal called successfully');
    } catch (error) {
      console.error('🔄 ❌ Error calling onExchangeMeal:', error);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Meal Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 mb-1">{meal.name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {(meal.prep_time || 0) + (meal.cook_time || 0)} min
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {meal.calories} cal
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="bg-green-50 p-2 rounded">
            <div className="font-semibold text-green-600">{meal.protein}g</div>
            <div className="text-xs text-gray-600">Protein</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-semibold text-blue-600">{meal.carbs}g</div>
            <div className="text-xs text-gray-600">Carbs</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="font-semibold text-yellow-600">{meal.fat}g</div>
            <div className="text-xs text-gray-600">Fat</div>
          </div>
        </div>

        {/* Action Buttons with explicit onClick handlers */}
        <div className="flex gap-2">
          <Button
            onClick={handleViewRecipe}
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            data-testid="view-recipe-button"
            type="button"
          >
            <ChefHat className="w-4 h-4 mr-2" />
            View Recipe
          </Button>
          <Button
            onClick={handleExchangeMeal}
            size="sm"
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            data-testid="exchange-meal-button"
            type="button"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Exchange Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
