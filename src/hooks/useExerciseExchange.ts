
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCentralizedCredits } from './useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isExchanging, setIsExchanging] = useState(false);
  const [weeklyExchangeCount, setWeeklyExchangeCount] = useState(0);

  // Calculate remaining exchanges and if user can exchange
  const remainingExchanges = Math.max(0, 2 - weeklyExchangeCount);
  const canExchange = remainingExchanges > 0;

  const exchangeExercise = async (params: { exerciseId: string; reason: string; preferences?: any }) => {
    const { exerciseId, reason, preferences } = params;
    
    if (!user?.id || !exerciseId || !reason.trim()) {
      console.error('Missing required data for exercise exchange');
      return null;
    }

    if (!canExchange) {
      toast.error('Weekly exchange limit reached');
      return null;
    }

    const creditResult = await checkAndUseCredit('exercise-exchange');
    if (!creditResult.success) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Exchanging exercise with AI');
      
      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          userId: user.id,
          exerciseId: exerciseId,
          reason: reason,
          preferences: preferences
        }
      });

      if (error) {
        console.error('❌ Exercise exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise exchange completed successfully');
        
        // Update weekly count
        setWeeklyExchangeCount(prev => prev + 1);
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        toast.success('Exercise exchanged successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Exercise exchange failed');
      }
    } catch (error: any) {
      console.error('❌ Exercise exchange failed:', error);
      toast.error('Failed to exchange exercise');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    exchangeExercise,
    isExchanging,
    weeklyExchangeCount,
    remainingExchanges,
    canExchange
  };
};
