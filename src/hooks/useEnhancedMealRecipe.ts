
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useAuth } from './useAuth';
import { useI18n } from "./useI18n";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface Meal {
  id: string;
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: { name: string; quantity: string; unit: string; }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  youtube_search_term?: string;
  image_url?: string;
  image?: string;
}

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
      // Since 'meals' table doesn't exist in the schema, we'll work with daily_meals
      const { data, error } = await supabase
        .from('daily_meals')
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

      // Convert DailyMeal to Meal format
      const convertedMeal: Meal = {
        id: data.id,
        type: data.meal_type,
        time: "12:00", // Default time
        name: data.name,
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: data.instructions || [],
        prepTime: data.prep_time || 0,
        cookTime: data.cook_time || 0,
        servings: data.servings || 1,
        youtube_search_term: data.youtube_search_term,
        image_url: data.image_url,
        image: data.image_url || ""
      };

      setMeal(convertedMeal);
      return convertedMeal;
    } catch (error: any) {
      console.error("Error fetching meal recipe:", error);
      toast.error(error.message || t('mealPlan.recipeFetchError') || 'Error fetching meal recipe');
      throw error;
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const { mutate: saveMealRecipe, isPending: isSaving } = useMutation({
    mutationFn: async (updates: Partial<Meal>) => {
      if (!user) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to save meal recipe');
      }

      if (!meal?.id) {
        throw new Error(t('mealPlan.noMealSelected') || 'No meal selected to update');
      }

      // Update daily_meals table instead of non-existent meals table
      const { data, error } = await supabase
        .from('daily_meals')
        .update({
          ingredients: updates.ingredients,
          instructions: updates.instructions,
          youtube_search_term: updates.youtube_search_term,
          image_url: updates.image_url || updates.image
        })
        .eq('id', meal.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating meal recipe:", error);
        throw new Error(t('mealPlan.recipeSaveFailed') || 'Failed to save meal recipe');
      }

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
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
    },
  });

  const generateEnhancedRecipe = async (mealId: string, currentMeal: Meal) => {
    try {
      // Mock enhanced recipe generation
      const enhancedRecipe = {
        ingredients: [
          { name: "Chicken breast", quantity: "200", unit: "g" },
          { name: "Rice", quantity: "100", unit: "g" },
          { name: "Vegetables", quantity: "150", unit: "g" }
        ],
        instructions: [
          "Prepare the ingredients",
          "Cook the chicken breast",
          "Cook the rice",
          "Steam the vegetables",
          "Serve together"
        ],
        youtube_search_term: `how to cook ${currentMeal.name}`,
        image_url: currentMeal.image_url
      };

      // Update the meal with enhanced recipe
      await saveMealRecipe(enhancedRecipe);
      return enhancedRecipe;
    } catch (error) {
      console.error('Error generating enhanced recipe:', error);
      throw error;
    }
  };

  const generateYouTubeSearchTerm = (mealName: string) => {
    return `how to cook ${mealName} recipe`;
  };

  return {
    meal,
    isRecipeLoading,
    fetchMealRecipe,
    saveMealRecipe,
    isSaving,
    generateEnhancedRecipe,
    generateYouTubeSearchTerm,
    isGeneratingRecipe: isRecipeLoading
  };
};
