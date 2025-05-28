
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

      try {
        // Check if user has generations remaining
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('ai_generations_remaining')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          throw new Error('Failed to check AI generations remaining');
        }
        
        if (profileData.ai_generations_remaining <= 0) {
          throw new Error('You have reached your AI generation limit (5 generations max). Please contact admin to increase your limit.');
        }

        console.log('Generating meal plan with enhanced prompt for user:', user.id);

        // Call the improved edge function
        const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
          body: {
            userProfile: {
              ...profile,
              id: user.id,
              email: user.email
            },
            preferences: {
              duration: preferences.duration || "1",
              cuisine: preferences.cuisine || profile.nationality || "International",
              maxPrepTime: preferences.maxPrepTime || "30",
              mealTypes: preferences.mealTypes || "5",
              ...preferences
            }
          }
        });

        if (error) {
          console.error('Meal plan generation error:', error);
          throw new Error(error.message || 'Failed to generate meal plan');
        }

        if (!data || !data.generatedPlan) {
          throw new Error('No meal plan was generated. Please try again.');
        }

        console.log('Generated meal plan structure:', data.generatedPlan);

        // Decrement AI generations
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ai_generations_remaining: profileData.ai_generations_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Failed to update AI generations remaining:', updateError);
        }

        // Save to database with enhanced structure
        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
        
        const { data: weeklyPlan, error: weeklyError } = await supabase
          .from('weekly_meal_plans')
          .upsert({
            user_id: user.id,
            week_start_date: weekStartDate.toISOString().split('T')[0],
            generation_prompt: {
              userProfile: profile,
              preferences,
              generatedAt: new Date().toISOString()
            },
            total_calories: data.generatedPlan.weekSummary?.totalCalories || 0,
            total_protein: data.generatedPlan.weekSummary?.totalProtein || 0,
            total_carbs: data.generatedPlan.weekSummary?.totalCarbs || 0,
            total_fat: data.generatedPlan.weekSummary?.totalFat || 0
          })
          .select()
          .single();

        if (weeklyError) {
          console.error('Error saving weekly plan:', weeklyError);
          throw weeklyError;
        }

        console.log('Saved weekly meal plan:', weeklyPlan);

        // Save daily meals with enhanced data structure
        if (data.generatedPlan.days && Array.isArray(data.generatedPlan.days)) {
          console.log(`Saving ${data.generatedPlan.days.length} days of meals`);
          
          for (const day of data.generatedPlan.days) {
            if (day.meals && Array.isArray(day.meals)) {
              for (const meal of day.meals) {
                const { error: mealError } = await supabase
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
                    youtube_search_term: meal.youtubeSearchTerm || null,
                    alternatives: meal.alternatives || []
                  });

                if (mealError) {
                  console.error('Error saving meal:', mealError);
                }
              }
            }
          }
        }

        console.log('Meal plan generation completed successfully');
        return data.generatedPlan;
      } catch (error: any) {
        console.error('Error in meal plan generation workflow:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('AI meal plan generated successfully! Your personalized plan is ready.');
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Meal plan generation failed:', error);
      toast.error(`Failed to generate meal plan: ${error.message}`);
    },
  });

  return {
    generateMealPlan: generateMealPlan.mutate,
    isGenerating: generateMealPlan.isPending,
  };
};
