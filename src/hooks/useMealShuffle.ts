
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';

export const useMealShuffle = () => {
  const [isShuffling, setIsShuffling] = useState(false);
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const shuffleMeals = async (weeklyPlanId: string) => {
    if (!user || !weeklyPlanId) {
      toast.error('Unable to shuffle meals. Please try again.');
      return;
    }

    setIsShuffling(true);
    
    try {
      console.log('🔄 Starting meal shuffle for plan:', weeklyPlanId);
      
      // Show immediate feedback
      toast.loading('Shuffling your meals across the week...', {
        duration: 10000,
      });

      // Use centralized credit system (using meal_plan type for shuffling)
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'meal_plan',
        promptData: {
          type: 'meal_shuffle',
          weeklyPlanId: weeklyPlanId
        }
      });

      try {
        const { data, error } = await supabase.functions.invoke('shuffle-weekly-meals', {
          body: {
            weeklyPlanId,
            userId: user.id
          }
        });

        // Dismiss loading toast
        toast.dismiss();

        if (error) {
          console.error('❌ Shuffle function error:', error);
          throw error;
        }

        if (data?.success) {
          console.log('✅ Meals shuffled successfully!');
          
          // Complete the AI generation log with success
          await completeGenerationAsync({
            logId: creditResult.log_id!,
            responseData: {
              weeklyPlanId: weeklyPlanId,
              shuffled: true
            }
          });

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
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Meal shuffle failed'
        });
        throw error;
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
