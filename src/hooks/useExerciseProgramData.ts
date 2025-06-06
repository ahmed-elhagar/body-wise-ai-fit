
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ExerciseProgram {
  id: string;
  created_at: string;
  name: string;
  description: string;
  user_id: string;
  difficulty: string;
  duration: number;
  focus: string;
  is_public: boolean;
}

const fetchExercisePrograms = async (userId: string | undefined): Promise<ExerciseProgram[]> => {
  if (!userId) {
    console.log('No user ID, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('weekly_exercise_programs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching exercise programs:', error);
    toast.error('Failed to fetch exercise programs. Please try again.');
    throw error;
  }

  return data || [];
};

export const useExerciseProgramData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: exercisePrograms,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['exercisePrograms', user?.id],
    queryFn: () => fetchExercisePrograms(user?.id),
    enabled: !!user?.id,
  });

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: ['exercisePrograms', user?.id] });
  };

  return {
    exercisePrograms: exercisePrograms || [],
    isLoading,
    error,
    refetch,
    invalidateQuery,
  };
};

export type { ExerciseProgram };
