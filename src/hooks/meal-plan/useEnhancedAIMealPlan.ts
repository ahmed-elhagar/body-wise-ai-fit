
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MealPlanPreferences } from '@/types/mealPlan';

export const useEnhancedAIMealPlan = () => {
  const { user } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEnhancedMealPlan = async (preferences: MealPlanPreferences, options?: { weekOffset?: number }): Promise<boolean> => {
    if (!user?.id || !profile) {
      toast.error(
        language === 'ar' 
          ? 'الملف الشخصي غير موجود'
          : 'User profile not found'
      );
      return false;
    }

    // Check credits
    const remainingCredits = profile.ai_generations_remaining || 0;
    if (remainingCredits <= 0) {
      toast.error(
        language === 'ar' 
          ? 'لا توجد أرصدة ذكاء اصطناعي متبقية'
          : 'No AI generations remaining. Please upgrade your plan.'
      );
      return false;
    }

    setIsGenerating(true);

    try {
      console.log('🚀 Starting Enhanced AI meal plan generation:', {
        userId: user.id,
        remainingCredits,
        preferences,
        weekOffset: options?.weekOffset || 0,
        includeSnacks: preferences.includeSnacks,
        profile: {
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          healthConditions: profile.health_conditions,
          specialConditions: profile.special_conditions,
          pregnancyTrimester: profile.pregnancy_trimester,
          breastfeedingLevel: profile.breastfeeding_level,
          fastingType: profile.fasting_type
        }
      });

      // Enhanced preferences with user profile data - CORRECTED STRUCTURE
      const enhancedPreferences = {
        ...preferences,
        language,
        weekOffset: options?.weekOffset || 0,
        mealsPerDay: preferences.includeSnacks ? 5 : 3,
        mealTypes: preferences.includeSnacks 
          ? ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
          : ['breakfast', 'lunch', 'dinner']
      };

      // FIXED: Proper userProfile structure matching what edge function expects
      const userProfileData = {
        id: profile.id,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        gender: profile.gender,
        activity_level: profile.activity_level,
        fitness_goal: profile.fitness_goal,
        health_conditions: profile.health_conditions || [],
        dietary_restrictions: profile.dietary_restrictions || [],
        allergies: profile.allergies || [],
        special_conditions: profile.special_conditions || [],
        pregnancy_trimester: profile.pregnancy_trimester,
        breastfeeding_level: profile.breastfeeding_level,
        fasting_type: profile.fasting_type,
        nationality: profile.nationality,
        preferred_language: profile.preferred_language || language
      };

      console.log('📤 Calling generate-meal-plan function with enhanced data:', {
        mealsPerDay: enhancedPreferences.mealsPerDay,
        includeSnacks: preferences.includeSnacks,
        weekOffset: enhancedPreferences.weekOffset,
        userProfileStructure: Object.keys(userProfileData)
      });

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: userProfileData,
          preferences: enhancedPreferences
        }
      });

      console.log('📥 Function response:', { 
        data: data ? { success: data.success, message: data.message } : null, 
        error: error ? { message: error.message, details: error.details } : null 
      });

      if (error) {
        console.error('❌ Error generating enhanced meal plan:', error);
        const errorMessage = error.message || 'Failed to generate meal plan';
        toast.error(
          language === 'ar' 
            ? 'فشل في إنشاء خطة الوجبات'
            : errorMessage
        );
        return false;
      }

      if (data?.success) {
        console.log('✅ Enhanced meal plan generated successfully:', {
          weeklyPlanId: data.weeklyPlanId,
          totalMeals: data.totalMeals,
          generationsRemaining: data.generationsRemaining,
          mealsPerDay: data.mealsPerDay,
          includeSnacks: data.includeSnacks,
          weekOffset: data.weekOffset
        });

        // Invalidate and refetch meal plan data
        await queryClient.invalidateQueries({
          queryKey: ['meal-plan']
        });

        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });

        // Refetch profile to update credits
        await refetchProfile();

        const successMessage = language === 'ar' 
          ? `تم إنشاء خطة الوجبات بنجاح! (${data.totalMeals} وجبة، ${data.mealsPerDay} وجبات يومياً)`
          : `Meal plan generated successfully! (${data.totalMeals} meals, ${data.mealsPerDay} per day)`;
        
        toast.success(successMessage);
        
        return true;
      } else {
        console.error('❌ Enhanced generation failed:', data?.error);
        toast.error(
          language === 'ar' 
            ? 'فشل في إنشاء خطة الوجبات'
            : data?.error || 'Failed to generate meal plan'
        );
        return false;
      }

    } catch (error: any) {
      console.error('❌ Exception during enhanced meal plan generation:', error);
      const errorMessage = error.message || 'Failed to generate meal plan';
      toast.error(
        language === 'ar' 
          ? 'فشل في إنشاء خطة الوجبات'
          : errorMessage
      );
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan: generateEnhancedMealPlan,
    isGenerating,
    remainingCredits: profile?.ai_generations_remaining || 0
  };
};
