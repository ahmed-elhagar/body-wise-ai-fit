
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isExchanging, setIsExchanging] = useState(false);

  const exchangeExercise = async (exerciseId: string, preferences: any) => {
    if (!user?.id) {
      console.error('No user ID available for exercise exchange');
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
      console.log('🔄 Exchanging exercise with AI');
      
      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          exerciseId,
          preferences,
          userId: user.id
        }
      });

      if (error) {
        console.error('❌ Exercise exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise exchange completed successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Exercise exchanged successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Exchange failed');
      }
    } catch (error) {
      console.error('❌ Exercise exchange failed:', error);
      toast.error('Failed to exchange exercise');
      throw error;
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    isExchanging,
    exchangeExercise
  };
};
