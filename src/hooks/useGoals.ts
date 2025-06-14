
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  user_id: string;
  goal_type: 'weight' | 'calories' | 'protein' | 'carbs' | 'fat';
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value: number;
  start_date: string;
  target_date?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  milestones: any[];
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  goal_type: 'weight' | 'calories' | 'protein' | 'carbs' | 'fat';
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value?: number;
  start_date?: string;
  target_date?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  notes?: string;
}

export const useGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user?.id,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: CreateGoalData) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('user_goals')
        .insert({ 
          user_id: user.id,
          goal_type: goalData.goal_type,
          title: goalData.title,
          description: goalData.description,
          target_value: goalData.target_value,
          target_unit: goalData.target_unit || (goalData.goal_type === 'weight' ? 'kg' : 'g'),
          current_value: goalData.current_value || 0,
          start_date: goalData.start_date || new Date().toISOString().split('T')[0],
          target_date: goalData.target_date,
          category: goalData.category || goalData.goal_type,
          priority: goalData.priority || 'medium',
          difficulty: goalData.difficulty || 'medium',
          status: 'active',
          milestones: [],
          tags: [],
          notes: goalData.notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal created successfully!');
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, ...goalData }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_goals')
        .update({
          ...goalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
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
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    },
  });

  // Helper functions for goal calculations
  const getWeightGoal = () => goals.find(goal => goal.goal_type === 'weight' && goal.status === 'active');
  
  const getMacroGoals = () => goals.filter(goal => 
    ['calories', 'protein', 'carbs', 'fat'].includes(goal.goal_type) && goal.status === 'active'
  );

  const calculateProgress = (goal: Goal) => {
    if (!goal.target_value || !goal.current_value) return 0;
    
    if (goal.goal_type === 'weight') {
      const startValue = goal.current_value;
      const targetValue = goal.target_value;
      const currentValue = goal.current_value;
      
      if (startValue === targetValue) return 100;
      
      const progress = Math.abs((currentValue - startValue) / (targetValue - startValue)) * 100;
      return Math.min(progress, 100);
    }
    
    // For macro goals, it's daily achievement
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  return {
    goals,
    isLoading,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    getWeightGoal,
    getMacroGoals,
    calculateProgress,
  };
};
