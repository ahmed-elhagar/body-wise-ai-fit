
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Goal } from '@/features/goals/types';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform database records to match Goal interface
      const transformedGoals: Goal[] = (data || []).map(goal => ({
        ...goal,
        difficulty: goal.difficulty || 'medium',
        start_date: goal.start_date || goal.created_at,
        current_value: goal.current_value || 0,
        milestones: Array.isArray(goal.milestones) ? goal.milestones : [],
        tags: Array.isArray(goal.tags) ? goal.tags : []
      }));
      
      setGoals(transformedGoals);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: any) => {
    if (!user) return;

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          ...goalData,
          user_id: user.id,
          difficulty: goalData.difficulty || 'medium',
          start_date: goalData.start_date || new Date().toISOString().split('T')[0],
          current_value: goalData.current_value || 0,
          milestones: Array.isArray(goalData.milestones) ? goalData.milestones : [],
          tags: Array.isArray(goalData.tags) ? goalData.tags : []
        })
        .select()
        .single();

      if (error) throw error;
      
      const transformedGoal: Goal = {
        ...data,
        difficulty: data.difficulty || 'medium',
        start_date: data.start_date || data.created_at,
        current_value: data.current_value || 0,
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      
      setGoals(prev => [transformedGoal, ...prev]);
      toast.success('Goal created successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to create goal');
    } finally {
      setIsCreating(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      
      const transformedGoal: Goal = {
        ...data,
        difficulty: data.difficulty || 'medium',
        start_date: data.start_date || data.created_at,
        current_value: data.current_value || 0,
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      
      setGoals(prev => prev.map(goal => goal.id === goalId ? transformedGoal : goal));
      toast.success('Goal updated successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Goal deleted successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to delete goal');
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    isLoading,
    isCreating,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
