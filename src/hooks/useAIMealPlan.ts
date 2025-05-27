
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIMealPlan = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const generateMealPlan = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id) {
        throw new Error('Please sign in to generate meal plans');
      }
      
      if (!profile) {
        throw new Error('Please complete your profile first');
      }

      console.log('Generating meal plan with preferences:', preferences);
      console.log('User profile:', profile);

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: profile,
          preferences
        }
      });

      if (error) {
        console.error('Meal plan generation error:', error);
        throw new Error(error.message || 'Failed to generate meal plan');
      }

      if (!data || !data.generatedPlan) {
        console.error('No meal plan in response:', data);
        throw new Error('No meal plan was generated');
      }

      console.log('Generated meal plan:', data.generatedPlan);

      // Save to database
      const { error: saveError } = await supabase
        .from('ai_meal_generations')
        .insert({
          user_id: user.id,
          prompt: JSON.stringify(preferences),
          generated_plan: data.generatedPlan,
          week_start_date: new Date().toISOString().split('T')[0]
        });

      if (saveError) {
        console.error('Error saving meal plan:', saveError);
        toast.error('Meal plan generated but not saved to database');
      } else {
        console.log('Meal plan saved to database successfully');
      }

      return data.generatedPlan;
    },
    onSuccess: (data) => {
      console.log('Meal plan generated successfully:', data);
      toast.success('AI meal plan generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['meal-plans', user?.id] });
    },
    onError: (error: any) => {
      console.error('Error generating meal plan:', error);
      const errorMessage = error.message || 'Failed to generate meal plan';
      toast.error(`Error: ${errorMessage}`);
    },
  });

  return {
    generateMealPlan: generateMealPlan.mutate,
    isGenerating: generateMealPlan.isPending,
    error: generateMealPlan.error,
    data: generateMealPlan.data,
  };
};
