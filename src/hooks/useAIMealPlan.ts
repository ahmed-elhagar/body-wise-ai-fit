
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
  includeSnacks: boolean;
  weekOffset?: number;
}

interface GenerationOptions {
  weekOffset?: number;
}

export const useAIMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateMealPlan = async (preferences: MealPlanPreferences, options: GenerationOptions = {}) => {
    if (!user) {
      toast.error(t('authRequired') || 'Authentication required');
      return { success: false, error: 'No user found' };
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting AI meal plan generation with enhanced debugging:', {
        userId: user.id,
        userEmail: user.email,
        preferences,
        options,
        weekOffset: options.weekOffset || 0
      });

      // Enhanced preferences with week offset
      const enhancedPreferences = {
        ...preferences,
        weekOffset: options.weekOffset || 0,
        timestamp: new Date().toISOString()
      };

      console.log('📊 Enhanced preferences for generation:', enhancedPreferences);

      // Use centralized credit system
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'meal_plan',
        promptData: enhancedPreferences
      });

      try {
        const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
          body: {
            userProfile: {
              id: user.id,
              email: user.email,
              ...user.user_metadata
            },
            preferences: enhancedPreferences
          }
        });

        console.log('📥 Edge function response received:', {
          success: data?.success,
          error: error?.message || data?.error,
          weeklyPlanId: data?.weeklyPlanId,
          totalMeals: data?.totalMeals,
          weekOffset: data?.weekOffset,
          includeSnacks: data?.includeSnacks
        });

        if (error) {
          console.error('❌ Supabase function invoke error:', error);
          throw new Error(error.message || 'Failed to generate meal plan');
        }

        if (!data?.success) {
          console.error('❌ Generation failed on server:', {
            serverError: data?.error,
            details: data?.details,
            serverResponse: data
          });
          
          throw new Error(data?.details || data?.error || 'Generation failed on server');
        }

        console.log('✅ Meal plan generation successful:', {
          weeklyPlanId: data.weeklyPlanId,
          totalMeals: data.totalMeals,
          weekStartDate: data.weekStartDate,
          weekOffset: data.weekOffset,
          generationsRemaining: data.generationsRemaining
        });

        // Complete the AI generation log with success
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          responseData: {
            weeklyPlanId: data.weeklyPlanId,
            totalMeals: data.totalMeals,
            weekStartDate: data.weekStartDate
          }
        });

        // Show success toast with details
        const successMessage = `${t('mealPlan.generatedSuccessfully')} (${data.totalMeals} meals)`;
        toast.success(successMessage);

        return {
          success: true,
          weeklyPlanId: data.weeklyPlanId,
          totalMeals: data.totalMeals,
          weekStartDate: data.weekStartDate,
          weekOffset: data.weekOffset,
          generationsRemaining: creditResult.remaining
        };
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Generation failed'
        });
        throw error;
      }

    } catch (error) {
      console.error('❌ Unexpected error during generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(t('mealPlan.generationFailed') || errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating
  };
};
