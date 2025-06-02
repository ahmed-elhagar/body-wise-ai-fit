
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { DailyMeal } from '@/hooks/meal-plan/types';

interface ExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onMealExchanged: () => void;
}

export const ExchangeDialog = ({
  isOpen,
  onClose,
  meal,
  onMealExchanged
}: ExchangeDialogProps) => {
  const { user } = useAuth();
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeReason, setExchangeReason] = useState('dietary');

  const handleExchangeMeal = async () => {
    if (!user || !meal) return;

    setIsExchanging(true);
    try {
      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          userId: user.id,
          mealId: meal.id,
          exchangeReason,
          originalMeal: meal
        }
      });

      if (error) throw error;

      toast.success('Meal exchanged successfully!');
      onMealExchanged();
      onClose();
    } catch (error: any) {
      console.error('Error exchanging meal:', error);
      toast.error(error.message || 'Failed to exchange meal');
    } finally {
      setIsExchanging(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exchange Meal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{meal.name}</p>
            <p className="text-sm text-gray-600">{meal.calories} calories</p>
          </div>

          <div>
            <Label htmlFor="exchange-reason">Reason for Exchange</Label>
            <Select value={exchangeReason} onValueChange={setExchangeReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dietary">Dietary Restrictions</SelectItem>
                <SelectItem value="preference">Food Preference</SelectItem>
                <SelectItem value="ingredients">Missing Ingredients</SelectItem>
                <SelectItem value="time">Preparation Time</SelectItem>
                <SelectItem value="variety">Want More Variety</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExchangeMeal} 
              className="flex-1"
              disabled={isExchanging}
            >
              {isExchanging ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Exchanging...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Exchange Meal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
