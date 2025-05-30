
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useMealShuffle = () => {
  const [isShuffling, setIsShuffling] = useState(false);
  const { user } = useAuth();

  const shuffleMeals = async (weeklyPlanId: string) => {
    if (!user || !weeklyPlanId) {
      toast.error('Unable to shuffle meals. Please try again.');
      return;
    }

    setIsShuffling(true);
    
    try {
      console.log('🔄 Starting meal shuffle for plan:', weeklyPlanId, 'user:', user.id);
      
      // Show immediate feedback
      toast.loading('Shuffling your meals across the week...', {
        duration: 10000,
      });

      // Call the shuffle function with proper authentication
      const { data, error } = await supabase.functions.invoke('shuffle-weekly-meals', {
        body: {
          weeklyPlanId,
          userId: user.id
        }
      });

      // Dismiss loading toast
      toast.dismiss();

      console.log('🔄 Shuffle function response:', { data, error });

      if (error) {
        console.error('❌ Shuffle function error:', error);
        throw new Error(error.message || 'Failed to shuffle meals');
      }

      if (data?.success) {
        console.log('✅ Meals shuffled successfully!', data);
        
        toast.success(
          `🎲 ${data.message} Your meals have been redistributed across the week!`,
          { duration: 4000 }
        );
        
        // Force reload to show updated meal distribution
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } else {
        throw new Error(data?.error || 'Failed to shuffle meals');
      }
      
    } catch (error: any) {
      console.error('❌ Error shuffling meals:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to shuffle meals. Please try again.');
    } finally {
      setIsShuffling(false);
    }
  };

  return {
    shuffleMeals,
    isShuffling
  };
};
