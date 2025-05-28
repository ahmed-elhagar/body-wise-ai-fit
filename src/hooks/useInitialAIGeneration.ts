
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useAIMealPlan } from './useAIMealPlan';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useInitialAIGeneration = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { generateMealPlan } = useAIMealPlan();
  const [hasTriggeredGeneration, setHasTriggeredGeneration] = useState(false);

  useEffect(() => {
    const triggerInitialGeneration = async () => {
      if (!user?.id || !profile || hasTriggeredGeneration) return;
      
      // Only trigger if onboarding is completed and we have essential profile data
      if (!profile.onboarding_completed || !profile.first_name || !profile.last_name) {
        return;
      }

      console.log('Checking if initial AI generation needed for user:', user.id);

      try {
        // Check if user already has meal plans
        const { data: existingMealPlans } = await supabase
          .from('weekly_meal_plans')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        // Check if user already has exercise programs
        const { data: existingExercisePrograms } = await supabase
          .from('weekly_exercise_programs')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        // If user has no meal plans, generate initial ones
        if (!existingMealPlans || existingMealPlans.length === 0) {
          console.log('Generating initial meal plan for new user');
          setHasTriggeredGeneration(true);
          
          const defaultPreferences = {
            duration: "1",
            cuisine: profile.nationality || "",
            maxPrepTime: "30",
            mealTypes: "5"
          };

          toast.success('Welcome! Generating your personalized meal plan...');
          generateMealPlan(defaultPreferences);
        }

        // TODO: Add exercise program generation when implemented
        // Similar logic for exercise programs
        
      } catch (error) {
        console.error('Error checking for initial generation:', error);
      }
    };

    // Small delay to ensure profile is fully loaded
    const timeoutId = setTimeout(triggerInitialGeneration, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, profile, generateMealPlan, hasTriggeredGeneration]);

  return { hasTriggeredGeneration };
};
