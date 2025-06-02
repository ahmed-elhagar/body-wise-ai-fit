
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Clock, Users, AlertCircle } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import type { DailyMeal } from '../../types';

interface ExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onSuccess: () => void;
}

export const ExchangeDialog = ({ isOpen, onClose, meal, onSuccess }: ExchangeDialogProps) => {
  const [isExchanging, setIsExchanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { language } = useMealPlanTranslations();
  const { userCredits } = useCreditSystem();
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!meal) return null;

  const handleExchange = async () => {
    if (!user?.id || !profile) {
      setError('User authentication required');
      return;
    }

    if (userCredits <= 0) {
      setError('No AI credits remaining');
      return;
    }

    setIsExchanging(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('exchange-meal', {
        body: {
          userProfile: {
            ...profile,
            id: user.id
          },
          mealId: meal.id,
          mealType: meal.meal_type,
          targetCalories: meal.calories,
          targetProtein: meal.protein,
          language
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to exchange meal');
      }

      console.log('✅ Meal exchanged successfully:', data);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('❌ Failed to exchange meal:', err);
      setError(err.message || 'Failed to exchange meal');
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Meal Info */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{meal.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {meal.prep_time + meal.cook_time} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {meal.servings} servings
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-orange-600">{meal.calories}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{meal.protein}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{meal.carbs}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{meal.fat}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            AI will find a similar meal with comparable nutrition values
          </div>

          {/* Credits Warning */}
          {userCredits <= 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-800">No AI credits remaining</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExchange} 
              className="flex-1"
              disabled={isExchanging || userCredits <= 0}
            >
              {isExchanging ? (
                <>
                  <ArrowLeftRight className="w-4 h-4 mr-2 animate-spin" />
                  Exchanging...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
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
