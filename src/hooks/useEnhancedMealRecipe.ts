
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import type { DailyMeal } from '@/features/meal-plan/types';

export const useEnhancedMealRecipe = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const generateEnhancedRecipe = async (mealId: string, mealData: DailyMeal) => {
    if (!user?.id || !mealId) {
      console.error('Missing required data for recipe generation');
      return null;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      console.error('No AI credits remaining');
      return null;
    }

    setIsGeneratingRecipe(true);

    try {
      console.log('🍳 Generating enhanced recipe for meal:', mealId);

      // Call the edge function to generate enhanced recipe
      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          mealId,
          mealData,
          userId: user.id,
          generateImage: true,
          enhanceInstructions: true
        }
      });

      if (error) {
        console.error('❌ Recipe generation error:', error);
        throw error;
      }

      if (data?.success && data?.meal) {
        console.log('✅ Enhanced recipe generated successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        // Update the meal in the database
        const { error: updateError } = await supabase
          .from('daily_meals')
          .update({
            ingredients: data.meal.ingredients,
            instructions: data.meal.instructions,
            alternatives: data.meal.alternatives,
            youtube_search_term: data.meal.youtube_search_term,
            image_url: data.meal.image_url,
            recipe_fetched: true
          })
          .eq('id', mealId);

        if (updateError) {
          console.error('❌ Failed to update meal:', updateError);
          throw updateError;
        }

        return data.meal;
      } else {
        throw new Error(data?.error || 'Recipe generation failed');
      }
    } catch (error) {
      console.error('❌ Enhanced recipe generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const generateYouTubeSearchTerm = (mealName: string) => {
    return `${mealName} recipe tutorial cooking`;
  };

  return {
    generateEnhancedRecipe,
    generateYouTubeSearchTerm,
    isGeneratingRecipe
  };
};
