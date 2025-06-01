import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Meal } from '@/types/meal';
import { useI18n } from "@/hooks/useI18n";

export const useMealRecipe = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, language } = useI18n();
  const queryClient = useQueryClient();

  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const showRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsRecipeOpen(true);
  };

  const closeRecipe = () => {
    setIsRecipeOpen(false);
    setSelectedMeal(null);
  };

  const updateMeal = useMutation({
    mutationFn: async (updates: Partial<Meal> & { id: string }) => {
      if (!user) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to update meal');
      }

      const { data, error } = await supabase
        .from('daily_meals')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating meal:', error);
        throw new Error(error.message || 'Could not update meal');
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Meal updated successfully:', data);
      toast.success(t('mealPlan.mealUpdatedSuccess') || 'Meal updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['meal-plan'] });
      queryClient.invalidateQueries({ queryKey: ['daily-meals'] });
    },
    onError: (error: any) => {
      console.error('Error updating meal:', error);
      toast.error(error.message || t('mealPlan.mealUpdateFailed') || 'Failed to update meal');
    },
  });

  const exchangeMeal = useMutation({
    mutationFn: async ({ meal, dayNumber }: { meal: Meal, dayNumber: number }) => {
      if (!user) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to exchange meal');
      }

      if (!profile) {
        throw new Error(t('profile.completeProfile') || 'Please complete your profile to exchange meal');
      }

      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          meal,
          dayNumber,
          userProfile: profile,
          language
        }
      });

      if (error) {
        console.error('Meal exchange error:', error);
        throw new Error(error.message || 'Failed to exchange meal');
      }

      return data;
    },
    onSuccess: () => {
      toast.success(t('mealPlan.mealExchangedSuccess') || 'Meal exchanged successfully!');
      queryClient.invalidateQueries({ queryKey: ['meal-plan'] });
      queryClient.invalidateQueries({ queryKey: ['daily-meals'] });
    },
    onError: (error: any) => {
      console.error('Error exchanging meal:', error);
      toast.error(error.message || t('mealPlan.mealExchangeFailed') || 'Failed to exchange meal');
    },
  });

  return {
    isRecipeOpen,
    selectedMeal,
    showRecipe,
    closeRecipe,
    updateMeal: updateMeal.mutate,
    isUpdating: updateMeal.isLoading,
    exchangeMeal: exchangeMeal.mutate,
    isExchanging: exchangeMeal.isLoading
  };
};
