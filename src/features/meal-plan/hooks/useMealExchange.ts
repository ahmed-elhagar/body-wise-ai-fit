
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  const generateAlternatives = async (meal: DailyMeal, reason: string) => {
    if (!user?.id || !meal?.id) {
      console.error('Missing required data for meal exchange');
      return false;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Generating meal alternatives');
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId: meal.id,
          meal: meal,
          reason: reason,
          userId: user.id
        }
      });

      if (error) {
        console.error('❌ Meal alternatives generation error:', error);
        throw error;
      }

      if (data?.success && data?.alternatives) {
        console.log('✅ Meal alternatives generated successfully');
        setAlternatives(data.alternatives);
        
        // Complete the generation process
        await completeGenerationAsync();
        
        return true;
      } else {
        throw new Error(data?.error || 'Alternative generation failed');
      }
    } catch (error) {
      console.error('❌ Meal alternatives generation failed:', error);
      toast.error('Failed to generate alternatives');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeMeal = async (alternative: any, onSuccess?: () => void) => {
    if (!alternative?.id) {
      console.error('No alternative selected for exchange');
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Exchanging meal');
      
      const { error } = await supabase
        .from('daily_meals')
        .update({
          name: alternative.name,
          calories: alternative.calories,
          protein: alternative.protein,
          carbs: alternative.carbs,
          fat: alternative.fat,
          prep_time: alternative.prep_time,
          cook_time: alternative.cook_time,
          ingredients: alternative.ingredients,
          instructions: alternative.instructions
        })
        .eq('id', alternative.original_meal_id || alternative.id);

      if (error) throw error;

      toast.success('Meal exchanged successfully!');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('❌ Meal exchange failed:', error);
      toast.error('Failed to exchange meal');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const quickExchange = async (meal: DailyMeal, reason: string, onSuccess?: () => void) => {
    const success = await generateAlternatives(meal, reason);
    if (success && alternatives.length > 0) {
      return await exchangeMeal(alternatives[0], onSuccess);
    }
    return false;
  };

  const clearAlternatives = () => {
    setAlternatives([]);
  };

  const hasAlternatives = alternatives.length > 0;

  return {
    isLoading,
    alternatives,
    generateAlternatives,
    exchangeMeal,
    quickExchange,
    clearAlternatives,
    hasAlternatives
  };
};
