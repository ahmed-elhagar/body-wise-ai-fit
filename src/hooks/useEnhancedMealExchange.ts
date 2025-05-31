
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';

export const useEnhancedMealExchange = () => {
  const [isExchanging, setIsExchanging] = useState(false);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { language } = useLanguage();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateMealAlternatives = async (currentMeal: any) => {
    if (!user?.id) {
      toast.error('Please sign in to get meal alternatives');
      return [];
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Generating meal alternatives for:', currentMeal.name, 'in language:', language);
      
      toast.loading('Finding meal alternatives...', { duration: 15000 });

      // Use credit system for meal exchange
      const creditResult = await checkAndUseCreditAsync('meal_plan');

      try {
        const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
          body: {
            currentMeal,
            userProfile: profile || {},
            preferences: {
              dietaryRestrictions: profile?.dietary_restrictions || [],
              allergies: profile?.allergies || [],
              preferredFoods: profile?.preferred_foods || []
            },
            language
          }
        });

        toast.dismiss();

        if (error) {
          console.error('❌ Meal alternatives generation error:', error);
          throw error;
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Failed to generate alternatives');
        }

        console.log('✅ Generated alternatives:', {
          total: data.alternatives?.length || 0,
          sources: data.source_breakdown
        });

        // Complete the AI generation log
        const creditData = creditResult as any;
        if (creditData?.log_id) {
          await completeGenerationAsync({
            logId: creditData.log_id,
            responseData: {
              alternativesCount: data.alternatives?.length || 0,
              sources: data.source_breakdown
            }
          });
        }

        const generatedAlternatives = data.alternatives || [];
        setAlternatives(generatedAlternatives);
        
        toast.success(`Found ${generatedAlternatives.length} meal alternatives!`);
        return generatedAlternatives;

      } catch (error) {
        // Mark generation as failed
        const creditData = creditResult as any;
        if (creditData?.log_id) {
          await completeGenerationAsync({
            logId: creditData.log_id,
            errorMessage: error instanceof Error ? error.message : 'Generation failed'
          });
        }
        throw error;
      }
      
    } catch (error: any) {
      console.error('❌ Error generating meal alternatives:', error);
      toast.dismiss();
      toast.error(language === 'ar' ? 
        `فشل في توليد البدائل: ${error.message}` :
        `Failed to generate alternatives: ${error.message}`
      );
      return [];
    } finally {
      setIsExchanging(false);
    }
  };

  const exchangeMeal = async (currentMeal: any, selectedAlternative: any) => {
    if (!user?.id || !selectedAlternative) {
      toast.error('Missing required data for meal exchange');
      return false;
    }

    try {
      console.log('🔄 Exchanging meal:', currentMeal.name, 'with:', selectedAlternative.name);
      
      toast.loading('Exchanging meal...', { duration: 10000 });

      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          mealId: currentMeal.id,
          mealType: currentMeal.meal_type,
          dayNumber: currentMeal.day_number,
          weeklyPlanId: currentMeal.weekly_plan_id,
          newMealData: selectedAlternative,
          userProfile: profile,
          language
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      console.log('✅ Meal exchanged successfully!');
      toast.success('Meal exchanged successfully!');
      return true;
      
    } catch (error: any) {
      console.error('❌ Error exchanging meal:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to exchange meal');
      return false;
    }
  };

  return {
    generateMealAlternatives,
    exchangeMeal,
    isExchanging,
    alternatives
  };
};
