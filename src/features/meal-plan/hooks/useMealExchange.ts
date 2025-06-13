
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  // Consolidated method that handles both AI generation and direct exchange
  const exchangeMeal = async (mealId: string, reason: string) => {
    if (!user?.id || !mealId || !reason.trim()) {
      console.error('Missing required data for meal exchange');
      return null;
    }

    const creditResult = await checkAndUseCredit('meal-exchange');
    if (!creditResult.success) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Exchanging meal with AI');
      
      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          userId: user.id,
          mealId: mealId,
          reason: reason
        }
      });

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchange completed successfully');
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        toast.success('Meal exchanged successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Meal exchange failed');
      }
    } catch (error: any) {
      console.error('❌ Meal exchange failed:', error);
      toast.error('Failed to exchange meal');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateAlternatives = async (meal: DailyMeal, reason: string) => {
    if (!user?.id || !meal?.id) {
      console.error('Missing required data for meal exchange');
      return false;
    }

    // Check and use credit before starting generation
    const creditResult = await checkAndUseCredit('meal-exchange');
    if (!creditResult.success) {
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
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        return true;
      } else {
        throw new Error(data?.error || 'Alternative generation failed');
      }
    } catch (error) {
      console.error('❌ Meal alternatives generation failed:', error);
      toast.error('Failed to generate alternatives');
      
      // Complete the generation with error
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeMealWithAlternative = async (alternative: any, onSuccess?: () => void) => {
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
      return await exchangeMealWithAlternative(alternatives[0], onSuccess);
    }
    return false;
  };

  const clearAlternatives = () => {
    setAlternatives([]);
  };

  const hasAlternatives = alternatives.length > 0;

  return {
    // Direct AI exchange method
    exchangeMeal,
    // Alternative-based exchange method  
    exchangeMealWithAlternative,
    // Loading states
    isExchanging: isLoading,
    isLoading,
    // Alternatives management
    alternatives,
    generateAlternatives,
    quickExchange,
    clearAlternatives,
    hasAlternatives
  };
};
