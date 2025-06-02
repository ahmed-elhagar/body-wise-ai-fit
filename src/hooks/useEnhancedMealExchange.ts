
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isExchanging, setIsExchanging] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  const generateMealAlternatives = async (meal: any) => {
    if (!user?.id) {
      console.error('No user ID available for meal exchange');
      return null;
    }

    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Generating meal alternatives with AI');
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId: meal.id,
          mealData: meal,
          userId: user.id,
          enhanced: true
        }
      });

      if (error) {
        console.error('❌ Meal alternatives generation error:', error);
        throw error;
      }

      if (data?.success && data?.alternatives) {
        console.log('✅ Meal alternatives generated successfully');
        setAlternatives(data.alternatives);
        await completeGenerationAsync();
        toast.success('Meal alternatives generated!');
        return data.alternatives;
      } else {
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ Meal alternatives generation failed:', error);
      toast.error('Failed to generate meal alternatives');
      throw error;
    } finally {
      setIsExchanging(false);
    }
  };

  const exchangeMeal = async (meal: any, alternative: any) => {
    if (!user?.id) {
      console.error('No user ID available for meal exchange');
      return null;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Exchanging meal with AI');
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId: meal.id,
          alternative: alternative,
          userId: user.id,
          enhanced: true,
          action: 'exchange'
        }
      });

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchange completed successfully');
        toast.success('Meal exchanged successfully!');
        return true;
      } else {
        throw new Error(data?.error || 'Exchange failed');
      }
    } catch (error) {
      console.error('❌ Meal exchange failed:', error);
      toast.error('Failed to exchange meal');
      return false;
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    isExchanging,
    exchangeMeal,
    generateMealAlternatives,
    alternatives
  };
};
