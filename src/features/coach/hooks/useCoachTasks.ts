
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CoachTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  type: 'review' | 'follow-up' | 'planning' | 'admin';
  completed: boolean;
  traineeId?: string;
  traineeName?: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

export const useCoachTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks from database with trainee names
  const { data: rawTasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['coach-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_tasks')
        .select(`
          *,
          trainee_profile:profiles!coach_tasks_trainee_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coach tasks:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Transform raw data to match expected interface
  const tasks: CoachTask[] = rawTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority as 'low' | 'medium' | 'high',
    type: task.type as 'review' | 'follow-up' | 'planning' | 'admin',
    completed: task.completed,
    traineeId: task.trainee_id,
    traineeName: task.trainee_profile 
      ? `${task.trainee_profile.first_name || ''} ${task.trainee_profile.last_name || ''}`.trim()
      : undefined,
    coach_id: task.coach_id,
    created_at: task.created_at,
    updated_at: task.updated_at,
  }));

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<CoachTask, 'id' | 'created_at' | 'updated_at' | 'coach_id' | 'traineeName'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate?.toISOString(),
          priority: taskData.priority,
          type: taskData.type,
          completed: taskData.completed,
          trainee_id: taskData.traineeId,
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

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('coach_tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      toast.success('Task updated');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  });

  // Complete task mutation (legacy support)
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
    refetch,
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isCreatingTask: createTaskMutation.isPending,
    toggleTask: toggleTaskMutation.mutate,
    isToggling: toggleTaskMutation.isPending,
    completeTask: completeTaskMutation.mutate,
    isCompletingTask: completeTaskMutation.isPending
  };
};
