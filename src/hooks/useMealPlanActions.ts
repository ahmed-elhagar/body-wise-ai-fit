
import { useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useMealPlanActions = (
  currentWeekPlan: any,
  currentWeekOffset: number,
  aiPreferences: any,
  refetchMealPlan: any
) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { generateMealPlan, isGenerating } = useAIMealPlan();

  // Enhanced AI generation handler with better cache management
  const handleGenerateAIPlan = useCallback(async () => {
    try {
      console.log('🚀 Starting AI meal plan generation with enhanced cache management:', {
        weekOffset: currentWeekOffset,
        preferences: aiPreferences,
        userId: user?.id
      });
      
      const enhancedPreferences = {
        ...aiPreferences,
        language: language,
        locale: language === 'ar' ? 'ar-SA' : 'en-US',
        weekOffset: currentWeekOffset
      };
      
      const result = await generateMealPlan(enhancedPreferences, { weekOffset: currentWeekOffset });
      
      if (result?.success) {
        console.log('✅ Generation successful, invalidating cache and refetching:', {
          weeklyPlanId: result.weeklyPlanId,
          weekOffset: currentWeekOffset
        });
        
        // Invalidate all meal plan queries to ensure fresh data
        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        // Wait a bit for the database to be fully updated
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Force immediate refetch with better error handling
        try {
          await refetchMealPlan?.();
          console.log('✅ Refetch completed successfully');
          return true;
        } catch (refetchError) {
          console.error('❌ Refetch failed after generation:', refetchError);
          toast.warning('Plan generated but may need a page refresh to display properly.');
          return true; // Still consider it successful since generation worked
        }
      } else {
        console.error('❌ Generation failed:', result?.error);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Generation failed with exception:', error);
      toast.error("Failed to generate meal plan. Please try again.");
      throw error;
    }
  }, [aiPreferences, language, currentWeekOffset, generateMealPlan, refetchMealPlan, queryClient, user?.id]);

  return {
    handleGenerateAIPlan,
    isGenerating
  };
};
