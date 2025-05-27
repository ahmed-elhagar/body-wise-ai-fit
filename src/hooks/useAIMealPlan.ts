
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

      // Check if user has generations remaining
      const canGenerate = await supabase.rpc('decrement_ai_generations', {
        user_id: user.id
      });

      if (!canGenerate.data) {
        throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
      }

      console.log('Generating meal plan with preferences:', preferences);

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
        throw new Error('No meal plan was generated');
      }

      // Save to database
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .upsert({
          user_id: user.id,
          week_start_date: weekStartDate.toISOString().split('T')[0],
          generation_prompt: preferences,
          total_calories: data.generatedPlan.weekSummary?.totalCalories || 0,
          total_protein: data.generatedPlan.weekSummary?.totalProtein || 0,
          total_carbs: data.generatedPlan.weekSummary?.totalCarbs || 0,
          total_fat: data.generatedPlan.weekSummary?.totalFat || 0
        })
        .select()
        .single();

      if (weeklyError) throw weeklyError;

      // Save daily meals
      if (data.generatedPlan.days) {
        for (const day of data.generatedPlan.days) {
          if (day.meals) {
            for (const meal of day.meals) {
              await supabase
                .from('daily_meals')
                .upsert({
                  weekly_plan_id: weeklyPlan.id,
                  day_number: day.dayNumber,
                  meal_type: meal.type,
                  name: meal.name || 'Unnamed Meal',
                  calories: meal.calories || 0,
                  protein: meal.protein || 0,
                  carbs: meal.carbs || 0,
                  fat: meal.fat || 0,
                  ingredients: meal.ingredients || [],
                  instructions: meal.instructions || [],
                  prep_time: meal.prepTime || 0,
                  cook_time: meal.cookTime || 0,
                  servings: meal.servings || 1,
                  youtube_search_term: meal.youtubeSearchTerm || null
                });
            }
          }
        }
      }

      return data.generatedPlan;
    },
    onSuccess: () => {
      toast.success('AI meal plan generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Error generating meal plan:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    generateMealPlan: generateMealPlan.mutate,
    isGenerating: generateMealPlan.isPending,
  };
};
