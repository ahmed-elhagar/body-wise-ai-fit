
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
  const [generationStatus, setGenerationStatus] = useState<string>('');
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
        setGenerationStatus('Checking existing content...');
        
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
          console.log('Generating initial personalized content for new user');
          setHasTriggeredGeneration(true);
          setIsGeneratingContent(true);
          
          // Enhanced default preferences based on user profile
          const defaultMealPreferences = {
            duration: "1",
            cuisine: profile.nationality || "International",
            maxPrepTime: "30",
            mealTypes: "5",
            dietaryGoal: profile.fitness_goal || "maintenance",
            allergies: profile.allergies || [],
            restrictions: profile.dietary_restrictions || []
          };

          const defaultExercisePreferences = {
            duration: "4",
            equipment: "Basic home equipment and gym options",
            workoutDays: profile.activity_level === 'sedentary' ? "2-3 days per week" :
                         profile.activity_level === 'very_active' ? "5-6 days per week" :
                         "3-4 days per week",
            difficulty: profile.activity_level === 'sedentary' ? "beginner" :
                       profile.activity_level === 'very_active' ? "advanced" :
                       "intermediate",
            fitnessGoal: profile.fitness_goal || "general_fitness"
          };

          toast.success('Welcome! Generating your personalized AI content based on your profile...');

          try {
            if (!hasMealPlans) {
              setGenerationStatus('Creating your personalized meal plan...');
              console.log('Generating meal plan with preferences:', defaultMealPreferences);
              
              await new Promise((resolve, reject) => {
                generateMealPlan(defaultMealPreferences);
                // Wait a bit for the mutation to complete
                setTimeout(() => {
                  resolve(true);
                }, 1000);
              });
              
              // Wait for meal plan generation to complete
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
            if (!hasExercisePrograms) {
              setGenerationStatus('Creating your personalized exercise program...');
              console.log('Generating exercise program with preferences:', defaultExercisePreferences);
              
              await new Promise((resolve, reject) => {
                generateExerciseProgram(defaultExercisePreferences);
                // Wait a bit for the mutation to complete
                setTimeout(() => {
                  resolve(true);
                }, 1000);
              });
              
              // Wait for exercise program generation to complete
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
            setIsGeneratingContent(false);
            setGenerationStatus('');
            toast.success('🎉 Your personalized content is ready! Explore your meal plans and workouts.');
            
          } catch (error) {
            console.error('Error during content generation:', error);
            setIsGeneratingContent(false);
            setGenerationStatus('');
            toast.error('There was an issue generating your content. You can create it manually from the respective pages.');
          }
        } else {
          console.log('User already has existing content, skipping initial generation');
        }
        
      } catch (error) {
        console.error('Error during initial generation check:', error);
        setIsGeneratingContent(false);
        setGenerationStatus('');
        generationAttempted.current = false; // Allow retry
      }
    };

    // Delay to ensure profile is fully loaded and avoid rapid triggers
    const timeoutId = setTimeout(triggerInitialGeneration, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, profile?.onboarding_completed, profile?.first_name, generateMealPlan, generateExerciseProgram]);

  return { 
    hasTriggeredGeneration, 
    isGeneratingContent: isGeneratingContent || isMealPlanGenerating || isExerciseGenerating,
    generationStatus
  };
};
