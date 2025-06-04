
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { MealExchangeService, type MealExchangeRequest, type MealAlternative } from '@/services/mealExchangeService';
import { toast } from 'sonner';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<MealAlternative[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);

  const mealExchangeService = MealExchangeService.getInstance();

  const generateAlternatives = useCallback(async (meal: DailyMeal, reason: string) => {
    if (!user?.id) {
      toast.error('Please log in to exchange meals');
      return false;
    }

    // Check credits before starting
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return false;
    }

    setIsLoading(true);
    setSelectedMeal(meal);
    
    try {
      const request: MealExchangeRequest = {
        mealId: meal.id,
        reason,
        preferences: {
          dietary_restrictions: [],
          max_prep_time: (meal.prep_time || 0) + (meal.cook_time || 0) + 15, // Allow 15 min buffer
        }
      };

      const generatedAlternatives = await mealExchangeService.generateAlternatives(request);
      setAlternatives(generatedAlternatives);
      
      await completeGenerationAsync();
      toast.success('Meal alternatives generated!');
      return true;
    } catch (error: any) {
      console.error('❌ Failed to generate alternatives:', error);
      toast.error(error.message || 'Failed to generate alternatives');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, checkAndUseCreditAsync, completeGenerationAsync, mealExchangeService]);

  const exchangeMeal = useCallback(async (alternative: MealAlternative, onSuccess?: () => void) => {
    if (!selectedMeal) {
      toast.error('No meal selected for exchange');
      return false;
    }

    setIsLoading(true);
    
    try {
      const success = await mealExchangeService.exchangeMeal(selectedMeal.id, alternative);
      
      if (success) {
        toast.success(`Meal exchanged to ${alternative.name}!`);
        setAlternatives([]);
        setSelectedMeal(null);
        onSuccess?.();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Failed to exchange meal:', error);
      toast.error(error.message || 'Failed to exchange meal');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedMeal, mealExchangeService]);

  const quickExchange = useCallback(async (meal: DailyMeal, reason: string, onSuccess?: () => void) => {
    if (!user?.id) {
      toast.error('Please log in to exchange meals');
      return null;
    }

    // Check credits before starting
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsLoading(true);
    
    try {
      const newMeal = await mealExchangeService.quickExchange(meal.id, reason);
      
      await completeGenerationAsync();
      toast.success(`Meal exchanged to ${newMeal.name}!`);
      onSuccess?.();
      return newMeal;
    } catch (error: any) {
      console.error('❌ Quick exchange failed:', error);
      toast.error(error.message || 'Quick exchange failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, checkAndUseCreditAsync, completeGenerationAsync, mealExchangeService]);

  const clearAlternatives = useCallback(() => {
    setAlternatives([]);
    setSelectedMeal(null);
  }, []);

  return {
    // State
    isLoading,
    alternatives,
    selectedMeal,
    
    // Actions
    generateAlternatives,
    exchangeMeal,
    quickExchange,
    clearAlternatives,
    
    // Helpers
    hasAlternatives: alternatives.length > 0,
  };
};
