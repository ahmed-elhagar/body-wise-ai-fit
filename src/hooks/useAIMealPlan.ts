
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
          total_calories: data.generatedPlan.totalNutrition?.calories || 0,
          total_protein: data.generatedPlan.totalNutrition?.protein || 0,
          total_carbs: data.generatedPlan.totalNutrition?.carbs || 0,
          total_fat: data.generatedPlan.totalNutrition?.fat || 0
        })
        .select()
        .single();

      if (weeklyError) throw weeklyError;

      // Save daily meals
      for (const [dayIndex, dayMeals] of data.generatedPlan.meals.entries()) {
        for (const [mealType, meal] of Object.entries(dayMeals)) {
          await supabase
            .from('daily_meals')
            .upsert({
              weekly_plan_id: weeklyPlan.id,
              day_number: dayIndex + 1,
              meal_type: mealType,
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              ingredients: meal.ingredients,
              instructions: meal.instructions,
              prep_time: meal.prepTime,
              cook_time: meal.cookTime,
              servings: meal.servings,
              youtube_search_term: meal.youtubeSearchTerm
            });
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
