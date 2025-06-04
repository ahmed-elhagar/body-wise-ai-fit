
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
      console.error('❌ No user ID available for exercise exchange');
      toast.error('Please log in to exchange exercises');
      return null;
    }

    // Check and use credit before starting exchange
    console.log('💳 Checking AI credits...');
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Exchanging exercise with AI:', {
        exerciseId: exerciseData.exerciseId,
        reason: exerciseData.reason,
        userId: user.id
      });
      
      const { data, error } = await Promise.race([
        supabase.functions.invoke('exchange-exercise', {
          body: {
            exerciseId: exerciseData.exerciseId,
            reason: exerciseData.reason,
            preferences: exerciseData.preferences,
            userId: user.id,
            userLanguage: 'en'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);

      if (error) {
        console.error('❌ Exercise exchange error:', error);
        
        // Handle specific error types
        if (error.message?.includes('timeout')) {
          throw new Error('Exchange request timed out. Please try again.');
        }
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
        const errorMessage = data?.error || 'Exchange failed';
        console.error('❌ Exchange failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Exercise exchange failed:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to exchange exercise';
      if (error.message?.includes('timeout')) {
        errorMessage = 'Exchange request timed out. Please try again.';
      } else if (error.message?.includes('not found')) {
        errorMessage = 'Exercise not found. Please refresh and try again.';
      } else if (error.message?.includes('AI service')) {
        errorMessage = 'AI service temporarily unavailable. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
