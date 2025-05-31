
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Sparkles, Clock, Users } from "lucide-react";
import { useAIMealExchange } from "@/hooks/useAIMealExchange";
import type { Meal } from "@/types/meal";

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeal: Meal;
  onExchange: (alternative: any) => void;
}

const MealExchangeDialog = ({ isOpen, onClose, currentMeal, onExchange }: MealExchangeDialogProps) => {
  const { generateAlternatives, isGenerating, alternatives } = useAIMealExchange();
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);

  const handleGenerateAlternatives = async () => {
    await generateAlternatives(currentMeal);
  };

  const handleExchange = async (alternative: any) => {
    // Here you could call a backend function to exchange the meal
    // For now, we'll just call the onExchange callback
    onExchange(alternative);
    onClose();
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
                  {(currentMeal.prepTime || 0) + (currentMeal.cookTime || 0)} min
                </Badge>
                <Badge>
                  <Users className="w-3 h-3 mr-1" />
                  {currentMeal.servings} serving{currentMeal.servings !== 1 ? 's' : ''}
                </Badge>
                <Badge>
                  {currentMeal.calories} cal
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-green-600">{currentMeal.protein}g</span>
                  <div className="text-gray-600">protein</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-blue-600">{currentMeal.carbs}g</span>
                  <div className="text-gray-600">carbs</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="font-medium text-yellow-600">{currentMeal.fat}g</span>
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
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Finding Alternatives...' : 'Find Meal Alternatives'}
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
                        disabled={isGenerating}
                        size="sm"
                      >
                        {isGenerating ? 'Exchanging...' : 'Select'}
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
                disabled={isGenerating}
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
