
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMealGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekOffset: number = 0) => {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { weekOffset }
      });
      
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate meal plan');
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
      toast.success('Meal plan generated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate meal plan');
    }
  });
};
