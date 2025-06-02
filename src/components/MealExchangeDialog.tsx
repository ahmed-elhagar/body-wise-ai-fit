
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import { useEnhancedMealExchange } from "@/hooks/useEnhancedMealExchange";
import { ExchangeCurrentMealCard } from "@/components/meal-plan/exchange/ExchangeCurrentMealCard";
import { ExchangeAlternativeCard } from "@/components/meal-plan/exchange/ExchangeAlternativeCard";
import type { DailyMeal } from "@/features/meal-plan/types";

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
    // Convert DailyMeal to format expected by the hook
    const mealForHook = {
      id: currentMeal.id,
      name: currentMeal.name,
      meal_type: currentMeal.meal_type,
      calories: currentMeal.calories || 0,
      protein: currentMeal.protein || 0,
      carbs: currentMeal.carbs || 0,
      fat: currentMeal.fat || 0,
      ingredients: currentMeal.ingredients || [],
      instructions: currentMeal.instructions || [],
      prep_time: currentMeal.prep_time || 0,
      cook_time: currentMeal.cook_time || 0,
      servings: currentMeal.servings || 1
    };
    await generateMealAlternatives(mealForHook);
  };

  const handleExchange = async (alternative: any) => {
    console.log('🔄 Exchanging meal with alternative:', alternative.name);
    // Convert DailyMeal to format expected by the hook
    const mealForHook = {
      id: currentMeal.id,
      name: currentMeal.name,
      meal_type: currentMeal.meal_type,
      calories: currentMeal.calories || 0,
      protein: currentMeal.protein || 0,
      carbs: currentMeal.carbs || 0,
      fat: currentMeal.fat || 0,
      ingredients: currentMeal.ingredients || [],
      instructions: currentMeal.instructions || [],
      prep_time: currentMeal.prep_time || 0,
      cook_time: currentMeal.cook_time || 0,
      servings: currentMeal.servings || 1
    };
    const success = await exchangeMeal(mealForHook, alternative);
    if (success) {
      onExchange();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Meal Info */}
          <ExchangeCurrentMealCard meal={currentMeal} />

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
                <ExchangeAlternativeCard
                  key={index}
                  alternative={alternative}
                  index={index}
                  isExchanging={isExchanging}
                  onSelect={handleExchange}
                  onExpand={setSelectedAlternative}
                />
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
