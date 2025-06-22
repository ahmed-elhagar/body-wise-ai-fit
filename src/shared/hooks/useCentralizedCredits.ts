import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSubscription } from './useSubscription';
import { supabase } from '@/integrations/supabase/client';

interface CreditState {
  remaining: number;
  total: number;
  isPro: boolean;
  hasCredits: boolean;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const { subscription, isPro } = useSubscription();
  const [credits, setCredits] = useState<CreditState>({
    remaining: 0,
    total: 0,
    isPro: false,
    hasCredits: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCredits();
    }
  }, [user?.id, subscription]);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      
      // For pro users, they have unlimited credits
      if (isPro) {
        setCredits({
          remaining: 999,
          total: 999,
          isPro: true,
          hasCredits: true
        });
        return;
      }

      // Fetch credits from database for free users
      const { data, error } = await supabase
        .from('user_credits')
        .select('remaining_credits, total_credits')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const remaining = data?.remaining_credits || 5;
      const total = data?.total_credits || 5;

      setCredits({
        remaining,
        total,
        isPro: false,
        hasCredits: remaining > 0
      });
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits({
        remaining: 5,
        total: 5,
        isPro: false,
        hasCredits: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUseCredit = async (): Promise<boolean> => {
    if (isPro) {
      return true;
    }

    if (credits.remaining <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ 
          remaining_credits: credits.remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setCredits(prev => ({
        ...prev,
        remaining: prev.remaining - 1,
        hasCredits: prev.remaining - 1 > 0
      }));

      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  const completeGeneration = async (success: boolean = true) => {
    if (!success && !isPro && user?.id) {
      try {
        await supabase
          .from('user_credits')
          .update({ 
            remaining_credits: credits.remaining + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        setCredits(prev => ({
          ...prev,
          remaining: prev.remaining + 1,
          hasCredits: true
        }));
      } catch (error) {
        console.error('Error refunding credit:', error);
      }
    }
  };

  return {
    ...credits,
    isLoading,
    checkAndUseCredit,
    completeGeneration,
    refetch: fetchCredits
  };
};
