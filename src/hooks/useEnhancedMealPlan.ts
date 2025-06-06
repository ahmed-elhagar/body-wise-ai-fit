
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCentralizedCredits } from './useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedMealPlan = () => {
  const { user } = useAuth();
  const { remaining: userCredits, isPro, hasCredits, checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGenerating, setIsGenerating] = useState(false);
  const [nutritionContext, setNutritionContext] = useState({
    isPregnant: false,
    isBreastfeeding: false,
    isMuslimFasting: false,
    hasHealthConditions: false,
    hasSpecialConditions: false,
    extraCalories: 0
  });

  const generateMealPlan = async (preferences: any, options?: { weekOffset?: number }): Promise<boolean> => {
    if (!user?.id) {
      console.error('❌ User not authenticated');
      toast.error('Please log in to generate a meal plan');
      return false;
    }

    console.log('🔐 User authenticated:', user.id);

    // Check credits before starting
    if (!hasCredits) {
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
      return false;
    }

    setIsGenerating(true);
    let logId: string | undefined;
    
    try {
      console.log('🍽️ Starting meal plan generation with preferences:', preferences);
      
      // Check and use credit before starting generation
      const creditResult = await checkAndUseCredit('meal_plan');
      if (!creditResult.success) {
        return false;
      }
      logId = creditResult.logId;

      // Get user profile data for better personalization
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📊 User profile loaded:', profile ? 'success' : 'no profile found');

      // Structure the request for meal plan generation
      const requestBody = {
        userData: {
          userId: user.id,
          email: user.email || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          age: profile?.age || null,
          gender: profile?.gender || null,
          height: profile?.height || null,
          weight: profile?.weight || null,
          fitness_goal: profile?.fitness_goal || null,
          activity_level: profile?.activity_level || null,
          preferred_language: profile?.preferred_language || 'en',
          dietary_restrictions: profile?.dietary_restrictions || [],
          allergies: profile?.allergies || [],
          special_conditions: profile?.special_conditions || {}
        },
        preferences: {
          ...preferences,
          userProfile: profile,
          userLanguage: profile?.preferred_language || 'en'
        },
        userLanguage: profile?.preferred_language || 'en',
        weekOffset: options?.weekOffset || 0
      };

      console.log('🚀 Calling meal plan edge function:', {
        userId: user.id,
        weekOffset: options?.weekOffset,
        hasProfile: !!profile
      });

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: requestBody
      });

      if (error) {
        console.error('❌ Meal plan generation error:', error);
        if (logId) await completeGeneration(logId, false);
        throw new Error(error.message || 'Generation failed');
      }

      if (data?.success) {
        console.log('✅ Meal plan generated successfully');
        
        // Complete the generation process
        if (logId) await completeGeneration(logId, true, data);
        
        // Set nutrition context if available, with safe defaults
        if (data.nutritionContext) {
          setNutritionContext({
            isPregnant: data.nutritionContext.isPregnant || false,
            isBreastfeeding: data.nutritionContext.isBreastfeeding || false,
            isMuslimFasting: data.nutritionContext.isMuslimFasting || false,
            hasHealthConditions: data.nutritionContext.hasHealthConditions || false,
            hasSpecialConditions: data.nutritionContext.hasSpecialConditions || false,
            extraCalories: data.nutritionContext.extraCalories || 0
          });
        }
        
        toast.success('Meal plan generated successfully!');
        return true;
      } else {
        if (logId) await completeGeneration(logId, false);
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ Meal plan generation failed:', error);
      if (logId) await completeGeneration(logId, false);
      toast.error(error.message || 'Failed to generate meal plan');
      return false;
    } finally {
      // Add a small delay before setting isGenerating to false
      // This ensures the loading dialog shows completion state before closing
      setTimeout(() => {
        setIsGenerating(false);
      }, 800);
    }
  };

  return {
    isGenerating,
    userCredits,
    isPro,
    hasCredits,
    generateMealPlan,
    nutritionContext
  };
};
