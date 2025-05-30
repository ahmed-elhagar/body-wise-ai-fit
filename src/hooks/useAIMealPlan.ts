
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
  const { language } = useLanguage();

  const generateMealPlan = async (preferences: MealPlanPreferences, options: GenerationOptions = {}) => {
    if (!user) {
      toast.error('Please log in to generate meal plans');
      return { success: false, error: 'No user found' };
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting AI meal plan generation:', {
        userId: user.id,
        userEmail: user.email,
        preferences,
        options,
        weekOffset: options.weekOffset || 0
      });

      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Failed to fetch user profile:', profileError);
        throw new Error('Failed to fetch user profile data');
      }

      // Enhanced preferences with week offset and language
      const enhancedPreferences = {
        ...preferences,
        weekOffset: options.weekOffset || 0,
        language: language || 'en',
        timestamp: new Date().toISOString()
      };

      console.log('📊 Enhanced preferences for generation:', enhancedPreferences);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: {
            id: user.id,
            email: user.email,
            ...profile,
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
        weekOffset: data?.weekOffset
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
        weekOffset: data.weekOffset
      });

      // Show success toast with details
      const successMessage = `Meal plan generated successfully! (${data.totalMeals} meals)`;
      toast.success(successMessage);

      return {
        success: true,
        weeklyPlanId: data.weeklyPlanId,
        totalMeals: data.totalMeals,
        weekStartDate: data.weekStartDate,
        weekOffset: data.weekOffset
      };

    } catch (error) {
      console.error('❌ Unexpected error during generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Generation failed: ${errorMessage}`);
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
