
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedMealShuffle = () => {
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleMeals = async (weeklyPlanId: string): Promise<boolean> => {
    setIsShuffling(true);
    try {
      const { data, error } = await supabase.functions.invoke('shuffle-weekly-meals', {
        body: { weeklyPlanId }
      });

      if (error) {
        console.error('Error shuffling meals:', error);
        toast.error('Failed to shuffle meals');
        return false;
      }

      toast.success('Meals shuffled successfully!');
      return true;
    } catch (error) {
      console.error('Error shuffling meals:', error);
      toast.error('Failed to shuffle meals');
      return false;
    } finally {
      setIsShuffling(false);
    }
  };

  return {
    shuffleMeals,
    isShuffling
  };
};
