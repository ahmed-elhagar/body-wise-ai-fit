
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import type { MealPlanPreferences } from '@/types/mealPlan';

export const useAIMealPlan = () => {
  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMealPlan = async (preferences: MealPlanPreferences, options?: { weekOffset?: number }) => {
    if (!user?.id || !profile) {
      toast.error('User profile not found');
      return { success: false, error: 'User profile not found' };
    }

    // Check credits
    const remainingCredits = profile.ai_generations_remaining || 0;
    if (remainingCredits <= 0) {
      toast.error('No AI generations remaining. Please upgrade your plan.');
      return { success: false, error: 'No credits remaining' };
    }

    setIsGenerating(true);

    try {
      console.log('🚀 Starting AI meal plan generation with credits check:', {
        userId: user.id,
        remainingCredits,
        preferences,
        weekOffset: options?.weekOffset || 0
      });

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: profile,
          preferences: {
            ...preferences,
            weekOffset: options?.weekOffset || 0
          }
        }
      });

      if (error) {
        console.error('❌ Error generating meal plan:', error);
        toast.error(error.message || 'Failed to generate meal plan');
        return { success: false, error: error.message };
      }

      if (data?.success) {
        console.log('✅ Meal plan generated successfully:', {
          weeklyPlanId: data.weeklyPlanId,
          totalMeals: data.totalMeals,
          generationsRemaining: data.generationsRemaining
        });

        // Invalidate and refetch meal plan data
        await queryClient.invalidateQueries({
          queryKey: ['meal-plan']
        });

        // Refetch profile to update credits
        await refetchProfile();

        toast.success(data.message || 'Meal plan generated successfully!');
        
        return {
          success: true,
          weeklyPlanId: data.weeklyPlanId,
          totalMeals: data.totalMeals,
          generationsRemaining: data.generationsRemaining
        };
      } else {
        console.error('❌ Generation failed:', data?.error);
        toast.error(data?.error || 'Failed to generate meal plan');
        return { success: false, error: data?.error };
      }

    } catch (error: any) {
      console.error('❌ Exception during meal plan generation:', error);
      toast.error(error.message || 'Failed to generate meal plan');
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating,
    remainingCredits: profile?.ai_generations_remaining || 0
  };
};
