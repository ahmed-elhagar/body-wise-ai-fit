
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMealRecipe = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const generateRecipe = async (mealId: string) => {
    if (!user?.id || !mealId) {
      console.error('Missing required data for recipe generation');
      return null;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGeneratingRecipe(true);

    try {
      console.log('🍳 Generating recipe for meal:', mealId);

      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          mealId,
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
        console.log('✅ Recipe generated successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        return data.meal;
      } else {
        throw new Error(data?.error || 'Recipe generation failed');
      }
    } catch (error) {
      console.error('❌ Recipe generation failed:', error);
      toast.error('Failed to generate recipe');
      throw error;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return {
    generateRecipe,
    isGeneratingRecipe
  };
};
