
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, Loader2, RefreshCw } from "lucide-react";
import type { DailyMeal } from '../../types';
import { toast } from 'sonner';

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onExchangeComplete?: () => void;
}

export const MealExchangeDialog = ({
  isOpen,
  onClose,
  meal,
  onExchangeComplete
}: MealExchangeDialogProps) => {
  const [isExchanging, setIsExchanging] = useState(false);
  const [alternatives, setAlternatives] = useState<DailyMeal[]>([]);

  const handleGenerateAlternatives = async () => {
    if (!meal) return;
    
    setIsExchanging(true);
    try {
      // Simulate API call for alternatives
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock alternatives
      const mockAlternatives: DailyMeal[] = [
        {
          ...meal,
          id: 'alt-1',
          name: `${meal.name} Alternative 1`,
          calories: meal.calories + 50
        },
        {
          ...meal,
          id: 'alt-2', 
          name: `${meal.name} Alternative 2`,
          calories: meal.calories - 30
        }
      ];
      
      setAlternatives(mockAlternatives);
      toast.success('Alternatives generated successfully!');
    } catch (error) {
      toast.error('Failed to generate alternatives');
    } finally {
      setIsExchanging(false);
    }
  };

  const handleExchange = async (alternative: DailyMeal) => {
    setIsExchanging(true);
    try {
      // Simulate exchange API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Meal exchanged successfully!');
      onExchangeComplete?.();
      onClose();
    } catch (error) {
      toast.error('Failed to exchange meal');
    } finally {
      setIsExchanging(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Meal */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Current Meal</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{meal.name}</h4>
                    <p className="text-sm text-gray-600">{meal.calories} calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Alternatives Button */}
          {alternatives.length === 0 && (
            <Button
              onClick={handleGenerateAlternatives}
              disabled={isExchanging}
              className="w-full"
            >
              {isExchanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Alternatives...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Alternatives
                </>
              )}
            </Button>
          )}

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Alternative Meals</h3>
              <div className="space-y-3">
                {alternatives.map((alternative) => (
                  <Card key={alternative.id} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{alternative.name}</h4>
                          <p className="text-sm text-gray-600">{alternative.calories} calories</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleExchange(alternative)}
                          disabled={isExchanging}
                        >
                          {isExchanging ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Exchange'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
