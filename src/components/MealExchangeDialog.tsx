
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RefreshCw, Check } from "lucide-react";

interface MealAlternative {
  name: string;
  calories: number;
  reason: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealExchangeDialogProps {
  currentMeal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  alternatives: MealAlternative[];
  isOpen: boolean;
  onClose: () => void;
  onExchange: (alternative: MealAlternative) => void;
}

const MealExchangeDialog = ({ 
  currentMeal, 
  alternatives, 
  isOpen, 
  onClose, 
  onExchange 
}: MealExchangeDialogProps) => {
  if (!currentMeal) return null;

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
            <h3 className="text-lg font-semibold mb-3">Alternative Meals</h3>
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
