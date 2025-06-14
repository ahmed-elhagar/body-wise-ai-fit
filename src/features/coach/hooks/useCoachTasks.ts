
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CoachTask {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  trainee_id?: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

export const useCoachTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks from database
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['coach-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_tasks')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coach tasks:', error);
        throw error;
      }

      return data as CoachTask[];
    },
    enabled: !!user?.id,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<CoachTask, 'id' | 'created_at' | 'updated_at' | 'coach_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          ...taskData,
          coach_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('coach_tasks')
        .update({ completed: true })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      toast.success('Task completed');
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    isCreatingTask: createTaskMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending
  };
};
