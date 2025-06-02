
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useCreditSystem = () => {
  const { user } = useAuth();
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserCredits();
    }
  }, [user?.id]);

  const fetchUserCredits = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        return;
      }

      setUserCredits(data?.ai_credits || 0);
    } catch (error) {
      console.error('Error fetching user credits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userCredits,
    isLoading,
    refetchCredits: fetchUserCredits
  };
};
