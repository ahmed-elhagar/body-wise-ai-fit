
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Sparkles, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  currentMeal: DailyMeal | null;
  onExchange?: () => void;
}

const MealExchangeDialog = ({ isOpen, onClose, currentMeal, onExchange }: MealExchangeDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isExchanging, setIsExchanging] = useState(false);

  const handleExchangeMeal = async () => {
    if (!currentMeal || !user) return;

    setIsExchanging(true);
    try {
      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          mealId: currentMeal.id,
          mealType: currentMeal.meal_type,
          dayNumber: currentMeal.day_number,
          weeklyPlanId: currentMeal.weekly_plan_id,
          userProfile: profile,
          targetCalories: currentMeal.calories,
          dietaryRestrictions: profile?.dietary_restrictions || [],
          allergies: profile?.allergies || []
        }
      });

      if (error) throw error;

      toast.success('Meal exchanged successfully!');
      onExchange?.();
      onClose(false);
    } catch (error) {
      console.error('Error exchanging meal:', error);
      toast.error('Failed to exchange meal');
    } finally {
      setIsExchanging(false);
    }
  };

  if (!currentMeal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1E1F23] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#FF6F3C]" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Meal Info */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Current Meal</h3>
              <p className="text-gray-300 mb-3">{currentMeal.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-[#FF6F3C] text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {(currentMeal.prep_time || 0) + (currentMeal.cook_time || 0)} min
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {currentMeal.servings} serving{currentMeal.servings !== 1 ? 's' : ''}
                </Badge>
                <Badge className="bg-green-600 text-white">
                  {currentMeal.calories} cal
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-700 p-2 rounded text-center">
                  <span className="font-medium text-green-400">{currentMeal.protein}g</span>
                  <div className="text-gray-400">protein</div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <span className="font-medium text-blue-400">{currentMeal.carbs}g</span>
                  <div className="text-gray-400">carbs</div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <span className="font-medium text-yellow-400">{currentMeal.fat}g</span>
                  <div className="text-gray-400">fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Info */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6F3C]" />
                AI Exchange
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                AI will find a similar meal with comparable nutrition that matches your dietary preferences and restrictions.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Calories:</span>
                  <span className="text-white">{currentMeal.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Meal Type:</span>
                  <span className="text-white capitalize">{currentMeal.meal_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Day:</span>
                  <span className="text-white">Day {currentMeal.day_number}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => onClose(false)}
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExchangeMeal}
              disabled={isExchanging}
              className="flex-1 bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              {isExchanging ? 'Exchanging...' : 'Exchange Meal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealExchangeDialog;
