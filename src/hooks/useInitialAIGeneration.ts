
import { useEffect, useState, useRef } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useAIMealPlan } from './useAIMealPlan';
import { useAIExercise } from './useAIExercise';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useInitialAIGeneration = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { generateMealPlan, isGenerating: isMealPlanGenerating } = useAIMealPlan();
  const { generateExerciseProgram, isGenerating: isExerciseGenerating } = useAIExercise();
  const [hasTriggeredGeneration, setHasTriggeredGeneration] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const generationAttempted = useRef(false);

  useEffect(() => {
    const triggerInitialGeneration = async () => {
      if (!user?.id || !profile || generationAttempted.current) return;
      
      // Only trigger if onboarding is completed and we have essential profile data
      if (!profile.onboarding_completed || !profile.first_name || !profile.last_name) {
        return;
      }

      console.log('Checking if initial AI generation needed for user:', user.id);
      generationAttempted.current = true;

      try {
        // Check if user already has any content
        const [mealPlansResult, exerciseProgramsResult] = await Promise.all([
          supabase
            .from('weekly_meal_plans')
            .select('id')
            .eq('user_id', user.id)
            .limit(1),
          supabase
            .from('weekly_exercise_programs')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
        ]);

        const hasMealPlans = mealPlansResult.data && mealPlansResult.data.length > 0;
        const hasExercisePrograms = exerciseProgramsResult.data && exerciseProgramsResult.data.length > 0;

        // If user has no content, generate both meal plan and exercise program
        if (!hasMealPlans || !hasExercisePrograms) {
          console.log('Generating initial content for new user');
          setHasTriggeredGeneration(true);
          setIsGeneratingContent(true);
          
          const defaultMealPreferences = {
            duration: "1",
            cuisine: profile.nationality || "International",
            maxPrepTime: "30",
            mealTypes: "5"
          };

          const defaultExercisePreferences = {
            duration: "4",
            equipment: "Basic home equipment",
            workoutDays: "3-4 days per week",
            difficulty: "beginner"
          };

          toast.success('Welcome! Generating your personalized content...');

          // Generate in sequence to avoid overwhelming the system
          try {
            if (!hasMealPlans) {
              await generateMealPlan(defaultMealPreferences);
            }
            
            // Small delay before generating exercise program
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (!hasExercisePrograms) {
              await generateExerciseProgram(defaultExercisePreferences);
            }
            
            setIsGeneratingContent(false);
            toast.success('Your personalized content is ready!');
          } catch (error) {
            console.error('Error during content generation:', error);
            setIsGeneratingContent(false);
            toast.error('There was an issue generating your content. You can create it manually from the respective pages.');
          }
        }
        
      } catch (error) {
        console.error('Error during initial generation check:', error);
        setIsGeneratingContent(false);
        generationAttempted.current = false; // Allow retry
      }
    };

    // Small delay to ensure profile is fully loaded
    const timeoutId = setTimeout(triggerInitialGeneration, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, profile, generateMealPlan, generateExerciseProgram]);

  return { 
    hasTriggeredGeneration, 
    isGeneratingContent: isGeneratingContent || isMealPlanGenerating || isExerciseGenerating 
  };
};
