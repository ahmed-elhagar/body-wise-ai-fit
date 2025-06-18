
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [remaining, setRemaining] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        // Check subscription status
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        const isProUser = !!subscription;
        setIsPro(isProUser);

        // Get credits from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_generations_remaining')
          .eq('id', user.id)
          .single();

        const credits = profile?.ai_generations_remaining || 0;
        setRemaining(credits);

      } catch (error) {
        console.error('Error fetching credits:', error);
        setRemaining(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [user?.id]);

  const hasCredits = remaining > 0 || isPro;

  const consumeCredit = async () => {
    if (!user?.id || isPro) return true;

    if (remaining <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: remaining - 1 })
        .eq('id', user.id);

      if (error) throw error;

      setRemaining(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error consuming credit:', error);
      return false;
    }
  };

  return {
    remaining,
    isPro,
    hasCredits,
    isLoading,
    consumeCredit
  };
};
