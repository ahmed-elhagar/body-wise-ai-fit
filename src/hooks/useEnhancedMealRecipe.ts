import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { Meal } from '@/types/meal';
import { useI18n } from "@/hooks/useI18n";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEnhancedMealRecipe = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  const fetchMealRecipe = async (mealId: string): Promise<Meal> => {
    setIsRecipeLoading(true);
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', mealId)
        .single();

      if (error) {
        console.error("Error fetching meal recipe:", error);
        throw new Error(t('mealPlan.recipeFetchFailed') || 'Failed to fetch meal recipe');
      }

      if (!data) {
        throw new Error(t('mealPlan.recipeNotFound') || 'Meal recipe not found');
      }

      setMeal(data);
      return data as Meal;
    } catch (error: any) {
      console.error("Error fetching meal recipe:", error);
      toast.error(error.message || t('mealPlan.recipeFetchError') || 'Error fetching meal recipe');
      throw error;
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const { mutate: saveMealRecipe, isLoading: isSaving } = useMutation({
    mutationFn: async (updates: Partial<Meal>) => {
      if (!user) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to save meal recipe');
      }

      if (!meal?.id) {
        throw new Error(t('mealPlan.noMealSelected') || 'No meal selected to update');
      }

      const { data, error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', meal.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating meal recipe:", error);
        throw new Error(t('mealPlan.recipeSaveFailed') || 'Failed to save meal recipe');
      }

      // Optimistically update the cache
      queryClient.setQueryData(['meal', meal.id], (old: any) => ({
        ...old,
        ...updates,
      }));

      return data;
    },
    onSuccess: () => {
      toast.success(t('mealPlan.recipeSavedSuccess') || 'Meal recipe saved successfully!');
    },
    onError: (error: any) => {
      console.error("Error saving meal recipe:", error);
      toast.error(error.message || t('mealPlan.recipeSaveError') || 'Error saving meal recipe');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  return {
    meal,
    isRecipeLoading,
    fetchMealRecipe,
    saveMealRecipe,
    isSaving
  };
};
