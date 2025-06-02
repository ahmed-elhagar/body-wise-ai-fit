
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Sparkles, Clock, Users } from "lucide-react";
import { useEnhancedMealExchange } from "@/hooks/useEnhancedMealExchange";
import type { DailyMeal } from "@/hooks/meal-plan/useMealPlanData";

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeal: DailyMeal | null;
  onExchange: () => void;
}

const MealExchangeDialog = ({ isOpen, onClose, currentMeal, onExchange }: MealExchangeDialogProps) => {
  const { generateMealAlternatives, exchangeMeal, isExchanging, alternatives } = useEnhancedMealExchange();
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);

  console.log('🔄 MealExchangeDialog rendered with meal:', currentMeal?.name);

  // Early return if no meal is provided
  if (!currentMeal) {
    return null;
  }

  const handleGenerateAlternatives = async () => {
    console.log('🔄 Generating alternatives for meal:', currentMeal.name);
    // Convert DailyMeal to Meal format for the hook
    const mealForHook = {
      id: currentMeal.id,
      type: currentMeal.meal_type,
      time: "12:00",
      name: currentMeal.name,
      calories: currentMeal.calories || 0,
      protein: currentMeal.protein || 0,
      carbs: currentMeal.carbs || 0,
      fat: currentMeal.fat || 0,
      ingredients: currentMeal.ingredients || [],
      instructions: currentMeal.instructions || [],
      cookTime: currentMeal.cook_time || 0,
      prepTime: currentMeal.prep_time || 0,
      servings: currentMeal.servings || 1,
      image: currentMeal.image_url || "",
      imageUrl: currentMeal.image_url,
      image_url: currentMeal.image_url,
      youtube_search_term: currentMeal.youtube_search_term
    };
    await generateMealAlternatives(mealForHook);
  };

  const handleExchange = async (alternative: any) => {
    console.log('🔄 Exchanging meal with alternative:', alternative.name);
    // Convert DailyMeal to Meal format for the hook
    const mealForHook = {
      id: currentMeal.id,
      type: currentMeal.meal_type,
      time: "12:00",
      name: currentMeal.name,
      calories: currentMeal.calories || 0,
      protein: currentMeal.protein || 0,
      carbs: currentMeal.carbs || 0,
      fat: currentMeal.fat || 0,
      ingredients: currentMeal.ingredients || [],
      instructions: currentMeal.instructions || [],
      cookTime: currentMeal.cook_time || 0,
      prepTime: currentMeal.prep_time || 0,
      servings: currentMeal.servings || 1,
      image: currentMeal.image_url || "",
      imageUrl: currentMeal.image_url,
      image_url: currentMeal.image_url,
      youtube_search_term: currentMeal.youtube_search_term
    };
    const success = await exchangeMeal(mealForHook, alternative);
    if (success) {
      onExchange();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Meal Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Current Meal</h3>
              <p className="mb-3">{currentMeal.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>
                  <Clock className="w-3 h-3 mr-1" />
                  {(currentMeal.prep_time || 0) + (currentMeal.cook_time || 0)} min
                </Badge>
                <Badge>
                  <Users className="w-3 h-3 mr-1" />
                  {currentMeal.servings || 1} serving{(currentMeal.servings || 1) !== 1 ? 's' : ''}
                </Badge>
                <Badge>
                  {currentMeal.calories || 0} cal
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-green-600">{currentMeal.protein || 0}g</span>
                  <div className="text-gray-600">protein</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-blue-600">{currentMeal.carbs || 0}g</span>
                  <div className="text-gray-600">carbs</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-yellow-600">{currentMeal.fat || 0}g</span>
                  <div className="text-gray-600">fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Alternatives Button */}
          {alternatives.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Meal Exchange
                </h3>
                <p className="text-sm mb-4">
                  AI will find similar meals with comparable nutrition that match your dietary preferences.
                </p>
                
                <Button
                  onClick={handleGenerateAlternatives}
                  disabled={isExchanging}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isExchanging ? 'Finding Alternatives...' : 'Find Meal Alternatives'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Alternatives List */}
          {alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Alternative Meals:</h3>
              {alternatives.map((alternative, index) => (
                <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedAlternative(alternative)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{alternative.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alternative.reason}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>{alternative.calories} cal</span>
                          <span>{alternative.protein}g protein</span>
                          <span>{alternative.carbs}g carbs</span>
                          <span>{alternative.fat}g fat</span>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExchange(alternative);
                        }}
                        disabled={isExchanging}
                        size="sm"
                      >
                        {isExchanging ? 'Exchanging...' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            {alternatives.length > 0 && (
              <Button
                onClick={handleGenerateAlternatives}
                disabled={isExchanging}
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate More
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealExchangeDialog;
