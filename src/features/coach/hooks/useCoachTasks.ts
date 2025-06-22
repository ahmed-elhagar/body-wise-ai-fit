
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
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
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['coach-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available');
        return [];
      }

      try {
        console.log('Fetching tasks for coach:', user.id);
        
        // First, get basic tasks data
        const { data: taskData, error: taskError } = await supabase
          .from('coach_tasks')
          .select('*')
          .eq('coach_id', user.id)
          .order('created_at', { ascending: false });

        if (taskError) {
          console.error('Error fetching tasks:', taskError);
          throw taskError;
        }

        console.log('Raw task data from database:', taskData);

        if (!taskData || taskData.length === 0) {
          console.log('No tasks found for user');
          return [];
        }

        // Get trainee names for tasks that have trainee_id
        const taskIds = taskData.map(task => task.id);
        const traineeIds = taskData
          .filter(task => task.trainee_id)
          .map(task => task.trainee_id);

        let traineeProfiles = [];
        if (traineeIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', traineeIds);

          if (profileError) {
            console.error('Error fetching trainee profiles:', profileError);
            // Don't throw error, just continue without trainee names
          } else {
            traineeProfiles = profiles || [];
          }
        }

        console.log('Trainee profiles:', traineeProfiles);

        // Map tasks with trainee names
        const mappedTasks = taskData.map((task: any) => {
          const traineeProfile = traineeProfiles.find(p => p.id === task.trainee_id);
          const traineeName = traineeProfile 
            ? `${traineeProfile.first_name || ''} ${traineeProfile.last_name || ''}`.trim()
            : undefined;

          return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            priority: task.priority as 'high' | 'medium' | 'low',
            type: task.type as 'review' | 'follow-up' | 'planning' | 'admin',
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
            traineeId: task.trainee_id,
            traineeName,
            completed: task.completed,
            createdAt: new Date(task.created_at)
          };
        });

        console.log('Mapped tasks:', mappedTasks);
        return mappedTasks;
      } catch (error) {
        console.error('Error in coach tasks query:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always refetch when component mounts
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<CoachTask, 'id' | 'createdAt'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating task:', newTask);

      const taskData = {
        coach_id: user.id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        type: newTask.type,
        due_date: newTask.dueDate?.toISOString(),
        trainee_id: newTask.traineeId || null,
        completed: newTask.completed
      };

      console.log('Task data to insert:', taskData);

      const { data, error } = await supabase
        .from('coach_tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      return data;
    },
    onSuccess: async (data) => {
      console.log('Task creation successful, invalidating and refetching queries');
      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      // Force immediate refetch
      setTimeout(() => {
        refetch();
      }, 100);
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      console.error('Task creation failed:', error);
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      console.log('Toggling task completion:', taskId, completed);
      
      const { error } = await supabase
        .from('coach_tasks')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) {
        console.error('Error toggling task:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      console.log('Task toggle successful, refetching data');
      await queryClient.invalidateQueries({ queryKey: ['coach-tasks'] });
      setTimeout(() => {
        refetch();
      }, 100);
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
    refetch,
  };
};
