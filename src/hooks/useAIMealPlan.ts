
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIMealPlan = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateMealPlan = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id || !profile) throw new Error('User not authenticated or profile incomplete');

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: profile,
          preferences
        }
      });

      if (error) throw error;

      // Save to database
      const { error: saveError } = await supabase
        .from('ai_meal_generations')
        .insert({
          user_id: user.id,
          prompt: JSON.stringify(preferences),
          generated_plan: data.generatedPlan,
          week_start_date: new Date().toISOString().split('T')[0]
        });

      if (saveError) throw saveError;

      return data.generatedPlan;
    },
    onSuccess: () => {
      toast.success('AI meal plan generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan');
    },
  });

  return {
    generateMealPlan: generateMealPlan.mutate,
    isGenerating: generateMealPlan.isPending,
  };
};
