
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useMealPlanActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deleteMealPlan, isPending: isDeleting } = useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('weekly_meal_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Meal plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
    },
    onError: (error: any) => {
      console.error('Error deleting meal plan:', error);
      toast.error('Failed to delete meal plan');
    }
  });

  const { mutate: regenerateMealPlan, isPending: isRegenerating } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Mock regeneration
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Meal plan regenerated successfully');
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
    },
    onError: (error: any) => {
      console.error('Error regenerating meal plan:', error);
      toast.error('Failed to regenerate meal plan');
    }
  });

  return {
    deleteMealPlan,
    isDeleting,
    regenerateMealPlan,
    isRegenerating
  };
};
