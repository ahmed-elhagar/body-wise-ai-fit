
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
  const [hasExistingContent, setHasExistingContent] = useState<boolean | null>(null);

  useEffect(() => {
    const checkExistingContent = async () => {
      if (!user?.id || !profile) return;
      
      // Don't check if we already know the status
      if (hasExistingContent !== null) return;

      console.log('Checking existing content for user:', user.id);
      
      try {
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
        
        const contentExists = hasMealPlans && hasExercisePrograms;
        setHasExistingContent(contentExists);
        
        console.log('Content check result:', {
          hasMealPlans,
          hasExercisePrograms,
          contentExists
        });
        
      } catch (error) {
        console.error('Error checking existing content:', error);
        setHasExistingContent(false);
      }
    };

    checkExistingContent();
  }, [user?.id, profile?.id, hasExistingContent]);

  useEffect(() => {
    const triggerInitialGeneration = async () => {
      if (!user?.id || !profile || generationAttempted.current) return;
      
      // Only trigger if onboarding is completed and we have essential profile data
      if (!profile.onboarding_completed || !profile.first_name || !profile.last_name) {
        return;
      }

      // Wait for content check to complete
      if (hasExistingContent === null) return;

      // If user already has content, don't generate
      if (hasExistingContent) {
        console.log('User already has existing content, skipping initial generation');
        return;
      }

      console.log('Triggering initial AI generation for new user:', user.id);
      generationAttempted.current = true;
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
        goalType: profile.fitness_goal || "general_fitness",
        fitnessLevel: profile.activity_level === 'sedentary' ? "beginner" :
                     profile.activity_level === 'very_active' ? "advanced" :
                     "intermediate",
        availableTime: "4",
        preferredWorkouts: ["strength", "cardio"],
        targetMuscleGroups: ["full_body"],
        equipment: ["Basic home equipment and gym options"],
        duration: "4",
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
        setGenerationStatus('Creating your personalized meal plan...');
        console.log('Generating meal plan with preferences:', defaultMealPreferences);
        
        await new Promise((resolve, reject) => {
          generateMealPlan(defaultMealPreferences);
          setTimeout(() => resolve(true), 1000);
        });
        
        // Wait for meal plan generation to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setGenerationStatus('Creating your personalized exercise program...');
        console.log('Generating exercise program with preferences:', defaultExercisePreferences);
        
        await new Promise((resolve, reject) => {
          generateExerciseProgram(defaultExercisePreferences);
          setTimeout(() => resolve(true), 1000);
        });
        
        // Wait for exercise program generation to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setIsGeneratingContent(false);
        setGenerationStatus('');
        setHasExistingContent(true); // Mark that content now exists
        toast.success('🎉 Your personalized content is ready! Explore your meal plans and workouts.');
        
      } catch (error) {
        console.error('Error during content generation:', error);
        setIsGeneratingContent(false);
        setGenerationStatus('');
        generationAttempted.current = false; // Allow retry
        toast.error('There was an issue generating your content. You can create it manually from the respective pages.');
      }
    };

    // Only trigger if we don't have existing content
    if (hasExistingContent === false) {
      const timeoutId = setTimeout(triggerInitialGeneration, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, profile?.onboarding_completed, profile?.first_name, hasExistingContent, generateMealPlan, generateExerciseProgram]);

  return { 
    hasTriggeredGeneration, 
    isGeneratingContent: isGeneratingContent || isMealPlanGenerating || isExerciseGenerating,
    generationStatus,
    hasExistingContent
  };
};
