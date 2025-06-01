
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Meal } from '@/types/meal';

export const useMealRecipe = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const { mutate: saveMealRecipe, isPending: isSavingRecipe } = useMutation({
    mutationFn: async (updates: Partial<Meal> & { id: string }) => {
      if (!user) {
        throw new Error('Please sign in to save meal recipe');
      }

      const { data, error } = await supabase
        .from('daily_meals')
        .update({
          ingredients: updates.ingredients ? JSON.stringify(updates.ingredients) : undefined,
          instructions: updates.instructions,
          youtube_search_term: updates.youtube_search_term,
          image_url: updates.image_url
        })
        .eq('id', updates.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating meal recipe:", error);
        throw new Error('Failed to save meal recipe');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Meal recipe saved successfully!');
    },
    onError: (error: any) => {
      console.error("Error saving meal recipe:", error);
      toast.error(error.message || 'Error saving meal recipe');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
    },
  });

  const { mutate: exchangeMeal, isPending: isExchangingMeal } = useMutation({
    mutationFn: async ({ meal, dayNumber }: { meal: Meal; dayNumber: number }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Mock exchange functionality
      console.log('Exchanging meal:', meal, 'for day:', dayNumber);
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Meal exchanged successfully!');
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
    },
    onError: (error: any) => {
      console.error('Error exchanging meal:', error);
      toast.error('Failed to exchange meal');
    }
  });

  const generateEnhancedRecipe = async (mealId: string, currentMeal: Meal) => {
    try {
      const enhancedRecipe = {
        id: mealId,
        ingredients: [
          { name: "Enhanced ingredient 1", quantity: "100", unit: "g" },
          { name: "Enhanced ingredient 2", quantity: "50", unit: "ml" }
        ],
        instructions: [
          "Enhanced instruction 1",
          "Enhanced instruction 2"
        ],
        youtube_search_term: `how to cook ${currentMeal.name}`,
        image_url: currentMeal.image_url
      };

      await saveMealRecipe(enhancedRecipe);
      return enhancedRecipe;
    } catch (error) {
      console.error('Error generating enhanced recipe:', error);
      throw error;
    }
  };

  return {
    selectedMeal,
    setSelectedMeal,
    saveMealRecipe,
    isSavingRecipe,
    exchangeMeal,
    isExchangingMeal,
    generateEnhancedRecipe
  };
};
