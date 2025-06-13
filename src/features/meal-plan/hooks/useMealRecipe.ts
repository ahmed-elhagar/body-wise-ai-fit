
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMealRecipe = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const generateRecipe = async (mealId: string) => {
    if (!user?.id || !mealId) {
      console.error('Missing required data for recipe generation');
      return null;
    }

    // Check and use credit before starting generation
    const creditResult = await checkAndUseCredit('recipe-generation');
    if (!creditResult.success) {
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
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        return data.meal;
      } else {
        throw new Error(data?.error || 'Recipe generation failed');
      }
    } catch (error) {
      console.error('❌ Recipe generation failed:', error);
      toast.error('Failed to generate recipe');
      
      // Complete the generation with error
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  // Enhanced recipe generation with more options (from useEnhancedMealRecipe)
  const generateEnhancedRecipe = async (mealId: string, enhancementOptions: any = {}) => {
    if (!user?.id || !mealId) {
      console.error('Missing required data for enhanced recipe generation');
      return null;
    }

    const creditResult = await checkAndUseCredit('enhanced-recipe-generation');
    if (!creditResult.success) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGeneratingRecipe(true);
    
    try {
      console.log('🍳 Generating enhanced recipe with AI');
      
      const { data, error } = await supabase.functions.invoke('generate-enhanced-recipe', {
        body: {
          userId: user.id,
          mealId: mealId,
          enhancementOptions: enhancementOptions
        }
      });

      if (error) {
        console.error('❌ Enhanced recipe generation error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Enhanced recipe generated successfully');
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        toast.success('Enhanced recipe generated successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Enhanced recipe generation failed');
      }
    } catch (error: any) {
      console.error('❌ Enhanced recipe generation failed:', error);
      toast.error('Failed to generate enhanced recipe');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return {
    generateRecipe,
    generateEnhancedRecipe, // Enhanced functionality
    isGeneratingRecipe,
    isGenerating: isGeneratingRecipe // Alias for backward compatibility
  };
};
