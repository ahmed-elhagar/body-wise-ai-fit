
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';

export const useMealRecipe = () => {
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateRecipe = async (mealId: string) => {
    if (!user) {
      toast.error('Please log in to view recipes');
      return null;
    }

    setIsGeneratingRecipe(true);
    
    try {
      console.log('🍳 Generating recipe for meal:', mealId, 'in language:', language);
      
      // Show immediate feedback
      toast.loading('Generating detailed recipe with images...', {
        duration: 15000,
      });

      // Use centralized credit system
      const hasCredit = await checkAndUseCreditAsync();
      if (!hasCredit) {
        toast.error('No AI credits remaining');
        return null;
      }

      try {
        const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
          body: {
            mealId: mealId,
            userId: user.id,
            language: language // Pass current language to recipe generation
          }
        });

        // Dismiss loading toast
        toast.dismiss();

        if (error) {
          console.error('❌ Recipe generation error:', error);
          throw error;
        }

        if (data?.success) {
          console.log('✅ Recipe generated successfully!');
          
          // Complete the AI generation
          await completeGenerationAsync();

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
        throw error;
      }
      
    } catch (error: any) {
      console.error('❌ Error generating recipe:', error);
      toast.dismiss();
      
      // Handle specific error cases
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

  return {
    generateRecipe,
    isGeneratingRecipe
  };
};
