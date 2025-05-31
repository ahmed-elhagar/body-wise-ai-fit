
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

      try {
        // Get tasks with trainee information
        const { data: taskData, error: taskError } = await supabase
          .from('coach_tasks')
          .select(`
            *,
            trainee:profiles!coach_tasks_trainee_id_fkey(first_name, last_name)
          `)
          .eq('coach_id', user.id)
          .order('created_at', { ascending: false });

        if (taskError) {
          console.error('Error fetching tasks:', taskError);
          throw taskError;
        }

        return taskData?.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          priority: task.priority as 'high' | 'medium' | 'low',
          type: task.type as 'review' | 'follow-up' | 'planning' | 'admin',
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          traineeId: task.trainee_id,
          traineeName: task.trainee ? `${task.trainee.first_name || ''} ${task.trainee.last_name || ''}`.trim() : undefined,
          completed: task.completed,
          createdAt: new Date(task.created_at)
        })) || [];
      } catch (error) {
        console.error('Error in coach tasks query:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<CoachTask, 'id' | 'createdAt'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating task:', newTask);

      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          coach_id: user.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          type: newTask.type,
          due_date: newTask.dueDate?.toISOString(),
          trainee_id: newTask.traineeId || null,
          completed: newTask.completed
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      toast.success('Task created successfully');
      console.log('Task creation successful, data:', data);
    },
    onError: (error: any) => {
      console.error('Task creation failed:', error);
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('coach_tasks')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) {
        console.error('Error toggling task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      console.error('Toggle task failed:', error);
      toast.error(`Failed to update task: ${error.message}`);
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
    createTaskAsync: createTaskMutation.mutateAsync,
  };
};
