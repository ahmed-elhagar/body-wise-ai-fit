
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

    if (!mealId) {
      toast.error('Meal ID is required to generate recipe');
      return null;
    }

    setIsGeneratingRecipe(true);
    
    try {
      console.log('🍳 Starting enhanced recipe generation for meal:', mealId, 'in language:', language);
      
      // First, check if recipe already exists in database
      const { data: existingMeal, error: fetchError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('id', mealId)
        .single();

      if (fetchError) {
        console.error('Error fetching meal:', fetchError);
        throw new Error('Failed to fetch meal data');
      }

      // If recipe already exists and is complete, return it
      if (existingMeal?.recipe_fetched && 
          existingMeal?.ingredients && 
          Array.isArray(existingMeal.ingredients) &&
          existingMeal.ingredients.length > 0 && 
          existingMeal?.instructions && 
          Array.isArray(existingMeal.instructions) &&
          existingMeal.instructions.length > 0) {
        console.log('✅ Recipe already exists in database, returning cached version');
        toast.success('Recipe loaded from cache!');
        return existingMeal;
      }

      // Show loading feedback
      toast.loading('Generating detailed recipe with AI...', {
        duration: 15000,
      });

      // Use credit system for recipe generation
      const creditResult = await checkAndUseCreditAsync('meal_plan');

      try {
        console.log('🔄 Making API call to generate-meal-recipe function');
        
        const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
          body: {
            mealId: mealId,
            userId: user.id,
            language: language,
            mealData: mealData || existingMeal
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
          const creditData = creditResult as any;
          if (creditData?.log_id) {
            await completeGenerationAsync({
              logId: creditData.log_id,
              responseData: {
                mealId: mealId,
                recipeGenerated: true,
                language: language
              }
            });
          }

          if (data.message?.includes('already available')) {
            toast.success('Recipe loaded from cache!');
          } else {
            toast.success(
              `🎉 Recipe generated! (${data.recipeCount || 1}/${data.dailyLimit || 10} today)`,
              { duration: 3000 }
            );
          }
          
          // Fetch updated meal data from database
          const { data: updatedMeal, error: refetchError } = await supabase
            .from('daily_meals')
            .select('*')
            .eq('id', mealId)
            .single();

          if (refetchError) {
            console.error('Error refetching updated meal:', refetchError);
            throw refetchError;
          }

          console.log('📄 Updated meal data:', updatedMeal);
          return updatedMeal;
          
        } else {
          throw new Error(data?.error || 'Failed to generate recipe');
        }
      } catch (error) {
        // Mark generation as failed
        const creditData = creditResult as any;
        if (creditData?.log_id) {
          await completeGenerationAsync({
            logId: creditData.log_id,
            errorMessage: error instanceof Error ? error.message : 'Recipe generation failed'
          });
        }
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
    if (!mealName) return 'cooking recipe tutorial';
    
    const cleanName = mealName.replace(/🍎\s*/, '').trim();
    return `${cleanName} recipe cooking tutorial`;
  };

  return {
    generateEnhancedRecipe,
    generateYouTubeSearchTerm,
    isGeneratingRecipe
  };
};
