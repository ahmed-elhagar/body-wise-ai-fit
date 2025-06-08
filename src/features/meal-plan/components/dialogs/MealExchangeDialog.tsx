
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { DailyMeal } from "../../types";

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onExchangeComplete: () => void;
}

export const MealExchangeDialog = ({ isOpen, onClose, meal, onExchangeComplete }: MealExchangeDialogProps) => {
  const { user } = useAuth();
  const [isExchanging, setIsExchanging] = useState(false);

  const handleExchange = async () => {
    if (!meal || !user) return;

    setIsExchanging(true);
    try {
      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          mealId: meal.id,
          mealType: meal.meal_type,
          dayNumber: meal.day_number
        }
      });

      if (error) throw error;

      toast.success('Meal exchanged successfully!');
      onExchangeComplete();
    } catch (error) {
      console.error('Error exchanging meal:', error);
      toast.error('Failed to exchange meal');
    } finally {
      setIsExchanging(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Would you like to exchange "{meal.name}" for a different meal?</p>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExchange} disabled={isExchanging} className="flex-1">
              {isExchanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exchanging...
                </>
              ) : (
                'Exchange'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
