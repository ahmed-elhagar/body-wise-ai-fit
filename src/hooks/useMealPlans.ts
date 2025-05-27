
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  created_at: string;
}

export interface Meal {
  id: string;
  meal_plan_id: string;
  day_of_week: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack_1' | 'snack_2';
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: any;
  recipe?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
}

export const useMealPlans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ['meal-plans', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          meals (*)
        `)
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createMealPlan = useMutation({
    mutationFn: async (planData: Omit<MealPlan, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          ...planData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans', user?.id] });
      toast.success('Meal plan created successfully!');
    },
    onError: (error) => {
      console.error('Meal plan creation error:', error);
      toast.error('Failed to create meal plan');
    },
  });

  return {
    mealPlans,
    isLoading,
    createMealPlan: createMealPlan.mutate,
    isCreating: createMealPlan.isPending,
  };
};
