
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RefreshCw, Check, Loader2 } from "lucide-react";
import { useAIMealExchange } from "@/hooks/useAIMealExchange";
import { useEffect } from "react";
import type { Meal } from "@/types/meal";

interface MealAlternative {
  name: string;
  calories: number;
  reason: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealExchangeDialogProps {
  currentMeal: Meal | null;
  alternatives?: MealAlternative[];
  isOpen: boolean;
  onClose: () => void;
  onExchange: (alternative: MealAlternative) => void;
}

const MealExchangeDialog = ({ 
  currentMeal, 
  alternatives: propAlternatives,
  isOpen, 
  onClose, 
  onExchange 
}: MealExchangeDialogProps) => {
  const { generateAlternatives, isGenerating, alternatives: aiAlternatives } = useAIMealExchange();

  // Generate alternatives when dialog opens with a meal
  useEffect(() => {
    if (isOpen && currentMeal && !propAlternatives) {
      generateAlternatives(currentMeal);
    }
  }, [isOpen, currentMeal, propAlternatives, generateAlternatives]);

  if (!currentMeal) return null;

  const alternatives = propAlternatives || aiAlternatives;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Meal */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Meal</h3>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-blue-900">{currentMeal.name}</h4>
                  <div className="flex space-x-4 mt-2 text-sm text-blue-700">
                    <span>{currentMeal.calories} cal</span>
                    <span>{currentMeal.protein}g protein</span>
                    <span>{currentMeal.carbs}g carbs</span>
                    <span>{currentMeal.fat}g fat</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Current</Badge>
              </div>
            </Card>
          </div>

          {/* Alternative Meals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Alternative Meals</h3>
              {!propAlternatives && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAlternatives(currentMeal)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate New'}
                </Button>
              )}
            </div>

            {isGenerating && !alternatives.length ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fitness-primary" />
                <p className="text-gray-600">Generating personalized alternatives...</p>
              </div>
            ) : alternatives.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {alternatives.map((alternative, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alternative.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alternative.reason}</p>
                        <div className="flex space-x-4 mt-2 text-sm text-gray-700">
                          <span className="font-medium">{alternative.calories} cal</span>
                          <span>{alternative.protein}g protein</span>
                          <span>{alternative.carbs}g carbs</span>
                          <span>{alternative.fat}g fat</span>
                        </div>
                        
                        {/* Calorie difference indicator */}
                        {Math.abs(alternative.calories - currentMeal.calories) <= 50 && (
                          <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                            Similar calories
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          onExchange(alternative);
                          onClose();
                        }}
                        className="ml-4 bg-fitness-gradient hover:opacity-90 text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Exchange
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p>Click "Generate New" to get personalized alternatives</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealExchangeDialog;
