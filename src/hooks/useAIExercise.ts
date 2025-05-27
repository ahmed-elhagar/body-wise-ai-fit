
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIExercise = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateExerciseProgram = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id || !profile) throw new Error('User not authenticated or profile incomplete');

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userProfile: profile,
          preferences
        }
      });

      if (error) throw error;

      // Save to database
      const { error: saveError } = await supabase
        .from('ai_exercise_generations')
        .insert({
          user_id: user.id,
          prompt: JSON.stringify(preferences),
          generated_program: data.generatedProgram,
          difficulty_level: preferences.difficulty,
          duration_weeks: preferences.durationWeeks
        });

      if (saveError) throw saveError;

      return data.generatedProgram;
    },
    onSuccess: () => {
      toast.success('AI exercise program generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating exercise program:', error);
      toast.error('Failed to generate exercise program');
    },
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
  };
};
