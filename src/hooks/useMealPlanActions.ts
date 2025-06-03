
import { useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnhancedMealPlan } from "@/hooks/useEnhancedMealPlan";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { formatWeekStartDate } from '@/utils/mealPlanUtils';

export const useMealPlanActions = (
  currentWeekPlan: any,
  currentWeekOffset: number,
  aiPreferences: any,
  refetchMealPlan: any
) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { generateMealPlan, isGenerating, nutritionContext } = useEnhancedMealPlan();

  // Enhanced AI generation handler with improved synchronization
  const handleGenerateAIPlan = useCallback(async () => {
    try {
      const weekStartDateStr = formatWeekStartDate(currentWeekOffset);
      
      console.log('🚀 STARTING ENHANCED AI MEAL PLAN GENERATION:', {
        weekOffset: currentWeekOffset,
        weekStartDate: weekStartDateStr,
        preferences: aiPreferences,
        userId: user?.id?.substring(0, 8) + '...',
        nutritionContext,
        timestamp: new Date().toISOString()
      });
      
      const enhancedPreferences = {
        ...aiPreferences,
        language: language,
        locale: language === 'ar' ? 'ar-SA' : 'en-US',
        weekOffset: currentWeekOffset,
        specialConditions: nutritionContext
      };
      
      const result = await generateMealPlan(enhancedPreferences, { weekOffset: currentWeekOffset });
      
      if (result) {
        console.log('✅ GENERATION SUCCESSFUL - STARTING DATA REFRESH:', {
          weekOffset: currentWeekOffset,
          weekStartDate: weekStartDateStr,
          timestamp: new Date().toISOString()
        });
        
        // Step 1: Invalidate all related queries immediately
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const isRelevant = query.queryKey[0] === 'weekly-meal-plan' || 
                              query.queryKey[0] === 'optimized-meal-plan' ||
                              query.queryKey[0] === 'meal-plan';
            
            if (isRelevant) {
              console.log('🗑️ Invalidating query:', query.queryKey);
            }
            
            return isRelevant;
          }
        });
        
        // Step 2: Wait for database consistency
        console.log('⏳ Waiting for database consistency...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 3: Force fresh data fetch for the current week
        console.log('🔄 Forcing fresh data fetch...');
        await queryClient.refetchQueries({
          queryKey: ['weekly-meal-plan', user?.id, currentWeekOffset],
          type: 'active'
        });
        
        // Step 4: Trigger manual refetch as backup
        if (refetchMealPlan) {
          console.log('🔄 Triggering manual refetch...');
          await refetchMealPlan();
        }
        
        // Step 5: Verify data exists
        setTimeout(async () => {
          const currentData = queryClient.getQueryData(['weekly-meal-plan', user?.id, currentWeekOffset]);
          console.log('🔍 POST-GENERATION DATA CHECK:', {
            hasData: !!currentData,
            weekOffset: currentWeekOffset,
            weekStartDate: weekStartDateStr,
            timestamp: new Date().toISOString()
          });
          
          if (!currentData) {
            console.warn('⚠️ No data found after generation, triggering final refetch...');
            await refetchMealPlan?.();
          }
        }, 1000);
        
        // Show success message with special condition info
        if (nutritionContext.isMuslimFasting) {
          toast.success(
            language === 'ar'
              ? 'تم إنشاء خطة وجبات متوافقة مع الصيام الإسلامي بنجاح!'
              : 'Muslim fasting-compatible meal plan generated successfully!'
          );
        } else {
          toast.success(
            language === 'ar'
              ? 'تم إنشاء خطة الوجبات بنجاح!'
              : 'Meal plan generated successfully!'
          );
        }
        
        return true;
      } else {
        console.error('❌ Generation returned false/null result');
        toast.error(
          language === 'ar'
            ? 'فشل في إنشاء خطة الوجبات'
            : 'Failed to generate meal plan'
        );
        return false;
      }
      
    } catch (error) {
      console.error('❌ GENERATION ERROR:', error);
      toast.error(
        language === 'ar'
          ? `خطأ في إنشاء خطة الوجبات: ${error.message}`
          : `Meal plan generation error: ${error.message}`
      );
      return false;
    }
  }, [aiPreferences, currentWeekOffset, generateMealPlan, queryClient, user?.id, refetchMealPlan, nutritionContext, language]);

  return {
    handleGenerateAIPlan: handleGenerateAIPlanEnhanced,
    isGenerating,
    nutritionContext
  };
};
