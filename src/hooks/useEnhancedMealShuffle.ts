
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useEnhancedMealShuffle = () => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleProgress, setShuffleProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const { user } = useAuth();

  const shuffleMeals = async (weeklyPlanId: string) => {
    if (!user || !weeklyPlanId) {
      toast.error('Unable to shuffle meals. Please try again.');
      return false;
    }

    setIsShuffling(true);
    setShuffleProgress(0);
    
    try {
      // Step 1: Preparing
      setCurrentStep('Preparing to shuffle meals...');
      setShuffleProgress(25);
      
      toast.loading('🔄 Shuffling your meals across the week...', {
        id: 'shuffle-loading',
        duration: 10000,
      });

      // Step 2: Shuffling
      setCurrentStep('Redistributing meals...');
      setShuffleProgress(50);

      const { data, error } = await supabase.functions.invoke('shuffle-weekly-meals', {
        body: {
          weeklyPlanId,
          userId: user.id
        }
      });

      // Step 3: Finalizing
      setCurrentStep('Finalizing changes...');
      setShuffleProgress(75);

      toast.dismiss('shuffle-loading');

      if (error) {
        throw new Error(error.message || 'Failed to shuffle meals');
      }

      if (data?.success) {
        setShuffleProgress(100);
        setCurrentStep('Complete!');
        
        toast.success(
          `🎲 Meals shuffled successfully! Your meals have been redistributed across the week.`,
          { duration: 4000 }
        );
        
        // Small delay to show completion
        setTimeout(() => {
          setIsShuffling(false);
          setShuffleProgress(0);
          setCurrentStep('');
        }, 1000);
        
        return true;
      } else {
        throw new Error(data?.error || 'Failed to shuffle meals');
      }
      
    } catch (error: any) {
      console.error('❌ Error shuffling meals:', error);
      toast.dismiss('shuffle-loading');
      toast.error(error.message || 'Failed to shuffle meals. Please try again.');
      
      setIsShuffling(false);
      setShuffleProgress(0);
      setCurrentStep('');
      return false;
    }
  };

  return {
    shuffleMeals,
    isShuffling,
    shuffleProgress,
    currentStep
  };
};
