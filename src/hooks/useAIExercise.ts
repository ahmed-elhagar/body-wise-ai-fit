
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
  weekStartDate?: string;
  weekOffset?: number;
}

export const useAIExercise = () => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const generateExerciseProgram = useMutation({
    mutationFn: async (request: ExerciseProgramRequest) => {
      if (!profile) {
        throw new Error('Profile not found. Please complete your profile first.');
      }

      console.log('🚀 Starting exercise program generation with request:', {
        workoutType: request.workoutType,
        goalType: request.goalType,
        fitnessLevel: request.fitnessLevel
      });

      // Prepare user data safely with proper null checks
      const userData = {
        userId: profile.id,
        age: profile.age || 25,
        gender: profile.gender || 'not specified',
        weight: profile.weight || 70,
        height: profile.height || 170,
        fitness_goal: profile.fitness_goal || 'general fitness',
        activity_level: profile.activity_level || 'moderately_active',
        health_conditions: profile.health_conditions || [],
        preferred_language: profile.preferred_language || 'en'
      };

      // Transform the request to match expected format
      const transformedRequest = {
        workoutType: request.workoutType || 'home',
        goalType: request.goalType || userData.fitness_goal,
        fitnessLevel: request.fitnessLevel || 'beginner',
        availableTime: request.availableTime || '45',
        preferredWorkouts: request.preferredWorkouts || ['bodyweight', 'cardio'],
        targetMuscleGroups: request.targetMuscleGroups || ['full_body'],
        equipment: request.equipment || (request.workoutType === 'gym' ? ['barbells', 'dumbbells', 'machines'] : ['bodyweight']),
        userLanguage: request.userLanguage || userData.preferred_language,
        weekStartDate: request.weekStartDate,
        weekOffset: request.weekOffset
      };

      console.log('📤 Sending request to edge function:', transformedRequest);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData,
          preferences: transformedRequest,
          userLanguage: userData.preferred_language
        }
      });

      if (error) {
        console.error('🚨 Exercise generation error:', error);
        throw new Error(error.message || 'Failed to generate exercise program');
      }

      if (!data || !data.success) {
        console.error('🚨 Invalid response from exercise generation:', data);
        throw new Error(data?.error || 'Invalid response from exercise generation service');
      }

      console.log('✅ Exercise generation response:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate exercise programs to refetch the new data
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      
      toast.success(`${data.workoutType === 'gym' ? 'Gym' : 'Home'} exercise program generated successfully!`);
      console.log('✅ Exercise program generation completed successfully');
    },
    onError: (error) => {
      console.error('🚨 Exercise generation error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to generate exercise program. Please try again.';
      
      if (error.message.includes('Profile not found')) {
        errorMessage = 'Please complete your profile before generating an exercise program.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      } else if (error.message.includes('parse')) {
        errorMessage = 'There was an issue processing your request. Please try again.';
      }
      
      toast.error(errorMessage);
    }
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
    error: generateExerciseProgram.error
  };
};
