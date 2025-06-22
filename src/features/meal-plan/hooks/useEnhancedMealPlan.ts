
import { useMemo } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';

export const useEnhancedMealPlan = () => {
  const { profile } = useProfile();
  
  // Use simplified credits approach - no dependencies on other meal plan hooks
  const credits = 5; // Default credits
  const isPro = false; // Default non-pro
  const hasCredits = credits > 0;

  // Simple meal plan generation function that doesn't create circular dependencies
  const generateMealPlan = async (preferences: any, options?: any) => {
    console.log('🚀 Generate meal plan called with:', { preferences, options });
    // This would normally call the meal plan generation service
    // For now, return a simple promise to avoid circular dependencies
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Mock meal plan generation completed');
        resolve(true);
      }, 1000);
    });
  };

  const isGenerating = false; // Simplified for now

  // Enhanced calculations without depending on useMealPlanState
  const enhancedData = useMemo(() => {
    // Calculate weekly nutrition summary
    const weeklyNutritionSummary = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      averageDailyCalories: 0,
    };

    // Calculate progress metrics
    const targetCalories = profile?.weight ? profile.weight * 30 : 2000;
    const progressMetrics = {
      calorieProgress: 0,
      proteinProgress: 0,
      varietyScore: 0,
    };

    // Generate recommendations
    const recommendations: string[] = [];

    return {
      weeklyNutritionSummary,
      progressMetrics,
      recommendations
    };
  }, [profile]);

  // Nutrition context for special conditions
  const nutritionContext = useMemo(() => {
    if (!profile) return {};
    
    return {
      isMuslimFasting: profile.fasting_type === 'ramadan' || profile.fasting_type === 'intermittent',
      isPregnant: profile.special_conditions?.includes('pregnancy'),
      isBreastfeeding: profile.special_conditions?.includes('breastfeeding'),
      specialConditions: profile.special_conditions || []
    };
  }, [profile]);

  return {
    ...enhancedData,
    credits,
    isPro,
    hasCredits,
    generateMealPlan,
    isGenerating,
    nutritionContext
  };
};
