
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
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        return;
      }

      setUserCredits(data?.ai_generations_remaining || 0);
    } catch (error) {
      console.error('Error fetching user credits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUseCreditAsync = async (): Promise<boolean> => {
    if (userCredits <= 0) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: userCredits - 1 })
        .eq('id', user?.id);

      if (error) {
        console.error('Error using credit:', error);
        return false;
      }

      setUserCredits(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  const completeGenerationAsync = async (): Promise<void> => {
    // This method is called after successful generation
    // Credits are already deducted in checkAndUseCreditAsync
    await fetchUserCredits(); // Refresh credits to ensure sync
  };

  return {
    userCredits,
    isLoading,
    refetchCredits: fetchUserCredits,
    checkAndUseCreditAsync,
    completeGenerationAsync
  };
};
