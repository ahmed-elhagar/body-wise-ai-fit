
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UpdateGoalProgressData {
  goalId: string;
  currentValue: number;
  notes?: string;
}

interface UpdateGoalStatusData {
  goalId: string;
  status: 'active' | 'completed' | 'paused';
}

interface UpdateGoalData {
  goalId: string;
  title?: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  targetDate?: string;
  difficulty?: string;
  priority?: string;
  notes?: string;
}

export const useGoalMutations = () => {
  const queryClient = useQueryClient();

  const updateProgressMutation = useMutation({
    mutationFn: async ({ goalId, currentValue, notes }: UpdateGoalProgressData) => {
      const updateData: any = {
        current_value: currentValue,
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('user_goals')
        .update(updateData)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast.success('Goal progress updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating goal progress:', error);
      toast.error('Failed to update goal progress');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ goalId, status }: UpdateGoalStatusData) => {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      const statusText = variables.status === 'completed' ? 'completed' : 
                        variables.status === 'paused' ? 'paused' : 'activated';
      toast.success(`Goal ${statusText} successfully!`);
    },
    onError: (error) => {
      console.error('Error updating goal status:', error);
      toast.error('Failed to update goal status');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ goalId, ...updateData }: UpdateGoalData) => {
      const dbUpdateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updateData.title) dbUpdateData.title = updateData.title;
      if (updateData.description) dbUpdateData.description = updateData.description;
      if (updateData.targetValue) dbUpdateData.target_value = updateData.targetValue;
      if (updateData.currentValue !== undefined) dbUpdateData.current_value = updateData.currentValue;
      if (updateData.targetDate) dbUpdateData.target_date = updateData.targetDate;
      if (updateData.difficulty) dbUpdateData.difficulty = updateData.difficulty;
      if (updateData.priority) dbUpdateData.priority = updateData.priority;
      if (updateData.notes) dbUpdateData.notes = updateData.notes;

      const { data, error } = await supabase
        .from('user_goals')
        .update(dbUpdateData)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast.success('Goal updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    },
  });

  return {
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateGoal: updateGoalMutation.mutate,
    isUpdatingGoal: updateGoalMutation.isPending,
  };
};
