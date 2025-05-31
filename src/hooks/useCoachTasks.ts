
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CoachTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  dueDate?: Date;
  traineeId?: string;
  traineeName?: string;
  completed: boolean;
  createdAt: Date;
}

export const useCoachTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks from database
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['coach-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get tasks with trainee information
      const { data: taskData, error: taskError } = await supabase
        .from('coach_tasks')
        .select(`
          *,
          trainee:profiles!coach_tasks_trainee_id_fkey(first_name, last_name)
        `)
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (taskError) throw taskError;

      return taskData?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        type: task.type,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        traineeId: task.trainee_id,
        traineeName: task.trainee ? `${task.trainee.first_name} ${task.trainee.last_name}` : undefined,
        completed: task.completed,
        createdAt: new Date(task.created_at)
      })) || [];
    },
    enabled: !!user?.id,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<CoachTask, 'id' | 'createdAt'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          coach_id: user.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          type: newTask.type,
          due_date: newTask.dueDate?.toISOString(),
          trainee_id: newTask.traineeId,
          completed: newTask.completed
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('coach_tasks')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    toggleTask: toggleTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isToggling: toggleTaskMutation.isPending,
  };
};
