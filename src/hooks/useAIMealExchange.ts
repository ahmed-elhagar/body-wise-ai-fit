
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export interface MealAlternative {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  source?: 'database' | 'ai';
}

export const useAIMealExchange = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { language, t } = useLanguage();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateAlternatives = useMutation({
    mutationFn: async (currentMeal: any) => {
      if (!user?.id) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to get meal alternatives');
      }

      console.log('🔄 Generating meal alternatives for:', currentMeal.name, 'in language:', language);

      // Use centralized credit system
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'meal_plan', // Using meal_plan type for meal exchanges
        promptData: {
          type: 'meal_exchange',
          currentMeal: currentMeal.name,
          language: language
        }
      });

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

        if (error) {
          console.error('Meal alternatives generation error:', error);
          throw new Error(error.message || 'Failed to generate meal alternatives');
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Failed to generate alternatives');
        }

        console.log('✅ Generated alternatives:', {
          total: data.alternatives?.length || 0,
          sources: data.source_breakdown
        });

        // Complete the AI generation log with success
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          responseData: {
            alternativesCount: data.alternatives?.length || 0,
            sources: data.source_breakdown
          }
        });

        return data.alternatives || [];
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Generation failed'
        });
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Error generating meal alternatives:', error);
      toast.error(language === 'ar' ? 
        `فشل في توليد البدائل: ${error.message}` :
        `Failed to generate alternatives: ${error.message}`
      );
    },
  });

  return {
    generateAlternatives: generateAlternatives.mutate,
    isGenerating: generateAlternatives.isPending,
    alternatives: generateAlternatives.data || [],
    error: generateAlternatives.error,
  };
};
