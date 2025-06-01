import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Meal } from '@/types/meal';
import { useI18n } from "@/hooks/useI18n";

interface ExchangeMealParams {
  meal: Meal;
  dayNumber: number;
}

export const useEnhancedMealExchange = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeal, setGeneratedMeal] = useState<Meal | null>(null);

  const { mutate: exchangeMeal, isLoading: isExchanging } = useMutation({
    mutationFn: async ({ meal, dayNumber }: ExchangeMealParams) => {
      if (!profile?.id) {
        throw new Error(t('profile.missing') || 'Profile information is missing');
      }

      setIsGenerating(true);
      setGeneratedMeal(null);

      const { data, error } = await supabase.functions.invoke('generate-ai-meal', {
        body: {
          userProfile: profile,
          preferences: {
            dietaryRestrictions: profile?.dietary_restrictions || [],
            allergies: profile?.allergies || [],
            preferredFoods: profile?.preferred_foods || []
          },
          currentMeal: meal,
          dayNumber: dayNumber
        }
      });

      if (error) {
        console.error('Error generating AI meal:', error);
        throw new Error(t('mealPlan.aiGenerationFailed') || 'Failed to generate AI meal');
      }

      if (!data?.success) {
        console.error('AI meal generation failed:', data?.error);
        throw new Error(data?.error || t('mealPlan.aiGenerationFailed') || 'Failed to generate AI meal');
      }

      setGeneratedMeal(data.meal);
      return data.meal;
    },
    onSuccess: (data, { dayNumber }) => {
      toast.success(t('mealPlan.mealExchangeSuccess') || 'Meal exchanged successfully!');
      queryClient.invalidateQueries({ queryKey: ['weeklyMealPlan'] });
      queryClient.invalidateQueries({ queryKey: ['dailyMeals', dayNumber] });
    },
    onError: (error: any) => {
      console.error('Error during meal exchange:', error);
      toast.error(error.message || t('mealPlan.mealExchangeFailed') || 'Failed to exchange meal');
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  return {
    exchangeMeal,
    isExchanging,
    isGenerating,
    generatedMeal
  };
};
