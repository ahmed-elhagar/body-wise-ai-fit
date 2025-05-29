
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
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
        const errorMessage = error.message || 'Failed to generate meal plan';
        toast.error(t('mealPlan.generationFailed') || errorMessage);
        return { success: false, error: errorMessage };
      }

      if (!data?.success) {
        console.error('❌ Generation failed on server:', {
          serverError: data?.error,
          details: data?.details,
          serverResponse: data
        });
        
        const errorMessage = data?.details || data?.error || 'Generation failed on server';
        toast.error(t('mealPlan.generationFailed') || errorMessage);
        return { success: false, error: errorMessage };
      }

      console.log('✅ Meal plan generation successful:', {
        weeklyPlanId: data.weeklyPlanId,
        totalMeals: data.totalMeals,
        weekStartDate: data.weekStartDate,
        weekOffset: data.weekOffset,
        generationsRemaining: data.generationsRemaining
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
        generationsRemaining: data.generationsRemaining
      };

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
