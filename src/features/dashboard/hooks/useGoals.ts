
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['user-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user goals:', error);
        throw error;
      }

      return data || [];
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: {
      goal_type: string;
      title: string;
      description?: string;
      target_value?: number;
      target_unit?: string;
      category: string;
      difficulty?: string;
      target_date?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast.success('Goal created successfully!');
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast.success('Goal deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    },
  });

  return {
    goals,
    isLoading,
    createGoal: createGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    deleteGoal: deleteGoalMutation.mutate,
    isDeleting: deleteGoalMutation.isPending,
  };
};
