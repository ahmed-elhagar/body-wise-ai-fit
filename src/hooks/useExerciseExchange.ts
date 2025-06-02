
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isExchanging, setIsExchanging] = useState(false);
  const [weeklyExchangeCount, setWeeklyExchangeCount] = useState(0);
  const [remainingExchanges, setRemainingExchanges] = useState(2);
  const [canExchange, setCanExchange] = useState(true);

  const exchangeExercise = async (exerciseData: { exerciseId: string; reason: string; preferences: any }) => {
    if (!user?.id) {
      console.error('No user ID available for exercise exchange');
      return null;
    }

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
          exerciseId: exerciseData.exerciseId,
          reason: exerciseData.reason,
          preferences: exerciseData.preferences,
          userId: user.id
        }
      });

      if (error) {
        console.error('❌ Exercise exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise exchange completed successfully');
        await completeGenerationAsync();
        
        // Update exchange counts
        setWeeklyExchangeCount(prev => prev + 1);
        setRemainingExchanges(prev => Math.max(0, prev - 1));
        setCanExchange(remainingExchanges > 1);
        
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
    exchangeExercise,
    weeklyExchangeCount,
    remainingExchanges,
    canExchange
  };
};
