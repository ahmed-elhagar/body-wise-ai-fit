
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIMealExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isExchanging, setIsExchanging] = useState(false);

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

    setIsExchanging(true);
    
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
      setIsExchanging(false);
    }
  };

  return {
    exchangeMeal,
    isExchanging
  };
};
