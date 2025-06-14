
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  goal_type: string;
  category: string;
  target_value?: number;
  current_value?: number;
  target_unit?: string;
  target_date?: string;
  created_at: string;
  updated_at: string;
}

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
      setGoals(data || []);
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
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [data, ...prev]);
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
      
      setGoals(prev => prev.map(goal => goal.id === goalId ? data : goal));
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
