
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useEnhancedMealShuffle = () => {
  const { user } = useAuth();
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleMeals = async (weeklyPlanId: string): Promise<boolean> => {
    if (!user?.id || !weeklyPlanId) {
      console.error('❌ Missing required data for shuffle:', { hasUser: !!user, weeklyPlanId });
      toast.error('Unable to shuffle meals - missing required data');
      return false;
    }

    setIsShuffling(true);
    
    try {
      console.log('🔄 Starting enhanced meal shuffle:', {
        userId: user.id,
        weeklyPlanId,
        timestamp: new Date().toISOString()
      });

      toast.loading('Shuffling your meals across the week...', { duration: 15000 });

      const { data, error } = await supabase.functions.invoke('shuffle-weekly-meals', {
        body: { 
          weeklyPlanId,
          userId: user.id // Ensure user ID is properly passed
        }
      });

      toast.dismiss();

      console.log('🔄 Shuffle function response:', { data, error });

      if (error) {
        console.error('❌ Shuffle function error:', error);
        throw new Error(error.message || 'Failed to shuffle meals');
      }

      if (data?.success) {
        console.log('✅ Meals shuffled successfully!', {
          message: data.message,
          shuffledCount: data.shuffledCount || 'unknown'
        });
        
        toast.success(
          `🎲 ${data.message || 'Meals shuffled successfully!'} Your meals have been redistributed across the week!`,
          { duration: 4000 }
        );
        
        return true;
      } else {
        console.error('❌ Shuffle operation failed:', data);
        throw new Error(data?.error || 'Failed to shuffle meals');
      }
      
    } catch (error: any) {
      console.error('❌ Error shuffling meals:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to shuffle meals. Please try again.');
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
