
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface CoachTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useCoachTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['coach-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // For now, return mock data since we don't have a tasks table yet
      const mockTasks: CoachTask[] = [
        {
          id: '1',
          title: 'Review Sarah\'s meal plan',
          description: 'Check nutritional balance and provide feedback',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          priority: 'high',
          completed: false,
          assignedTo: 'sarah-123',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Update exercise program for John',
          description: 'Increase intensity based on progress',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          priority: 'medium',
          completed: false,
          assignedTo: 'john-456',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ];

      return mockTasks;
    },
    enabled: !!user?.id,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<CoachTask, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Mock implementation - in real app, this would save to database
      const newTask: CoachTask = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return newTask;
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
      // Mock implementation
      console.log('Completing task:', taskId);
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
