
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useMealRecipe = () => {
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const { user } = useAuth();

  const generateRecipe = async (mealId: string) => {
    if (!user) {
      toast.error('Please log in to view recipes');
      return null;
    }

    setIsGeneratingRecipe(true);
    
    try {
      console.log('🍳 Generating recipe for meal:', mealId);
      
      // Show immediate feedback
      toast.loading('Generating detailed recipe with images...', {
        duration: 15000,
      });

      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          mealId: mealId,
          userId: user.id
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
      
    } catch (error: any) {
      console.error('❌ Error generating recipe:', error);
      toast.dismiss();
      
      // Handle specific error cases
      if (error.message?.includes('limit reached')) {
        toast.error('Daily recipe limit reached (10 per day). Try again tomorrow.');
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
