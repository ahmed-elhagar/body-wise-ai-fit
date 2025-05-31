
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';

export const useEnhancedMealRecipe = () => {
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateEnhancedRecipe = async (mealId: string, mealData?: any) => {
    if (!user) {
      toast.error('Please log in to view recipes');
      return null;
    }

    setIsGeneratingRecipe(true);
    
    try {
      console.log('🍳 Generating enhanced recipe for meal:', mealId, 'in language:', language);
      
      // Show loading feedback
      toast.loading('Generating detailed recipe with images...', {
        duration: 15000,
      });

      // Use credit system for recipe generation
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'meal_plan',
        promptData: {
          mealId: mealId,
          language: language,
          action: 'recipe_generation'
        }
      });

      try {
        const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
          body: {
            mealId: mealId,
            userId: user.id,
            language: language,
            mealData: mealData
          }
        });

        toast.dismiss();

        if (error) {
          console.error('❌ Recipe generation error:', error);
          throw error;
        }

        if (data?.success) {
          console.log('✅ Recipe generated successfully!');
          
          // Complete the AI generation log
          await completeGenerationAsync({
            logId: creditResult.log_id!,
            responseData: {
              mealId: mealId,
              recipeGenerated: true,
              language: language
            }
          });

          if (data.message.includes('already available')) {
            toast.success('Recipe loaded from cache!');
          } else {
            toast.success(
              `🎉 Recipe generated! (${data.recipeCount}/${data.dailyLimit} today)`,
              { duration: 3000 }
            );
          }
          
          // Fetch updated meal data
          const { data: updatedMeal, error: fetchError } = await supabase
            .from('daily_meals')
            .select('*')
            .eq('id', mealId)
            .single();

          if (fetchError) {
            throw fetchError;
          }

          return updatedMeal;
          
        } else {
          throw new Error(data?.error || 'Failed to generate recipe');
        }
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Recipe generation failed'
        });
        throw error;
      }
      
    } catch (error: any) {
      console.error('❌ Error generating recipe:', error);
      toast.dismiss();
      
      if (error.message?.includes('limit reached')) {
        toast.error('AI generation limit reached. Please upgrade or wait for credits to reset.');
      } else if (error.message?.includes('not found')) {
        toast.error('Meal not found. Please refresh and try again.');
      } else {
        toast.error(error.message || 'Failed to generate recipe. Please try again.');
      }
      
      return null;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const generateYouTubeSearchTerm = (mealName: string) => {
    const cleanName = mealName.replace(/🍎\s*/, '').trim();
    return `${cleanName} recipe cooking tutorial`;
  };

  return {
    generateEnhancedRecipe,
    generateYouTubeSearchTerm,
    isGeneratingRecipe
  };
};
