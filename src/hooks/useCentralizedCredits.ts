
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCentralizedCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error);
        return;
      }
      
      setCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const checkAndDeductCredits = async (amount: number = 1): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to use AI features');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check current credits
      await fetchCredits();
      
      if (credits < amount) {
        toast.error('Insufficient credits. Please upgrade your plan.');
        return false;
      }

      // Deduct credits
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: credits - amount })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deducting credits:', error);
        toast.error('Failed to process credits. Please try again.');
        return false;
      }

      setCredits(prev => prev - amount);
      return true;
    } catch (error) {
      console.error('Error processing credits:', error);
      toast.error('Failed to process credits. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user?.id]);

  return {
    credits,
    isLoading,
    fetchCredits,
    checkAndDeductCredits,
  };
};
