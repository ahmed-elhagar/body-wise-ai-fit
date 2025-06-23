
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedMealRecipe = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGenerating, setIsGenerating] = useState(false);

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

    setIsGenerating(true);
    
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
          await completeGeneration(creditResult.logId);
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
        await completeGeneration(creditResult.logId);
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateEnhancedRecipe,
    isGenerating
  };
};
