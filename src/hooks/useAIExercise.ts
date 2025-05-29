
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

interface ExerciseProgramRequest {
  goalType?: string;
  fitnessLevel?: string;
  availableTime?: string;
  preferredWorkouts?: string[];
  targetMuscleGroups?: string[];
  equipment?: string[];
  userLanguage?: string;
  workoutType?: "home" | "gym";
  // Additional properties for backward compatibility
  duration?: string;
  workoutDays?: string;
  difficulty?: string;
  fitnessGoal?: string;
}

export const useAIExercise = () => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const generateExerciseProgram = useMutation({
    mutationFn: async (request: ExerciseProgramRequest) => {
      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('Generating exercise program with request:', request);

      // Prepare user data safely with proper null checks
      const userData = {
        userId: profile.id,
        age: profile.age || 25,
        gender: profile.gender || 'not specified',
        weight: profile.weight || null,
        height: profile.height || null,
        fitness_goal: profile.fitness_goal || 'general fitness',
        activity_level: profile.activity_level || 'moderately_active',
        health_conditions: profile.health_conditions || [],
        preferred_language: profile.preferred_language || 'en'
      };

      // Transform the request to match expected format - ensure workoutType is properly set
      const transformedRequest = {
        workoutType: request.workoutType || 'home',
        goalType: request.goalType || request.fitnessGoal || userData.fitness_goal,
        fitnessLevel: request.fitnessLevel || request.difficulty || 'beginner',
        availableTime: request.availableTime || request.duration || '45',
        preferredWorkouts: request.preferredWorkouts || ['strength', 'cardio'],
        targetMuscleGroups: request.targetMuscleGroups || ['full_body'],
        equipment: request.equipment || (request.workoutType === 'gym' ? ['barbells', 'dumbbells', 'machines'] : ['bodyweight', 'resistance_bands', 'light_dumbbells']),
        userLanguage: request.userLanguage || userData.preferred_language
      };

      console.log('Transformed request:', transformedRequest);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData,
          preferences: transformedRequest,
          userLanguage: userData.preferred_language
        }
      });

      if (error) {
        console.error('Exercise generation error:', error);
        throw new Error(error.message || 'Failed to generate exercise program');
      }

      console.log('Exercise generation response:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate exercise programs to refetch the new data
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      toast.success('Exercise program generated successfully!');
    },
    onError: (error) => {
      console.error('Exercise generation error:', error);
      toast.error('Failed to generate exercise program. Please try again.');
    }
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
    error: generateExerciseProgram.error
  };
};
