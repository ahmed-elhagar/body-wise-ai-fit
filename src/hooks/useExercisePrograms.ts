
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ExerciseProgram {
  id: string;
  user_id: string;
  name: string;
  program_type: 'home' | 'gym' | 'outdoor';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks?: number;
  created_at: string;
}

export interface Exercise {
  id: string;
  program_id: string;
  day_of_week: number;
  name: string;
  muscle_group?: string;
  sets?: number;
  reps?: string;
  duration?: number;
  equipment?: string;
  youtube_video_id?: string;
  instructions?: string;
  calories_burned?: number;
}

export const useExercisePrograms = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery({
    queryKey: ['exercise-programs', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('exercise_programs')
        .select(`
          *,
          exercises (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createProgram = useMutation({
    mutationFn: async (programData: Omit<ExerciseProgram, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('exercise_programs')
        .insert({
          user_id: user.id,
          ...programData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-programs', user?.id] });
      toast.success('Exercise program created successfully!');
    },
    onError: (error) => {
      console.error('Program creation error:', error);
      toast.error('Failed to create exercise program');
    },
  });

  return {
    programs,
    isLoading,
    createProgram: createProgram.mutate,
    isCreating: createProgram.isPending,
  };
};
