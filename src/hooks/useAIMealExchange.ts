
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isExchanging, setIsExchanging] = useState(false);

  const exchangeMeal = async (mealId: string, preferences: any) => {
    if (!user?.id) {
      console.error('No user ID available for meal exchange');
      return null;
    }

    // Check and use credit before starting exchange
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Exchanging meal with AI');
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId,
          preferences,
          userId: user.id
        }
      });

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchange completed successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Meal exchanged successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Exchange failed');
      }
    } catch (error) {
      console.error('❌ Meal exchange failed:', error);
      toast.error('Failed to exchange meal');
      throw error;
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    isExchanging,
    exchangeMeal
  };
};
