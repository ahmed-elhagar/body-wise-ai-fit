
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';

export interface AIFoodAnalysisResult {
  food_name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  ingredients?: string[];
  nutrition_facts?: Record<string, any>;
}

export const useAIFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { checkAndUseCredits } = useCentralizedCredits();

  const analyzeFood = useMutation({
    mutationFn: async (imageData: string): Promise<AIFoodAnalysisResult> => {
      setIsAnalyzing(true);
      
      try {
        // Check credits first
        const creditResult = await checkAndUseCredits('food-analysis', {
          image_data: imageData
        });

        if (!creditResult.success) {
          throw new Error(creditResult.error || 'Insufficient credits');
        }

        // Call AI analysis function
        const { data, error } = await supabase.functions.invoke('analyze-food-image', {
          body: { imageData }
        });

        if (error) throw error;

        // Complete the generation log
        if (creditResult.success) {
          await supabase.functions.invoke('complete-ai-generation', {
            body: {
              logId: creditResult.remaining, // Using remaining as placeholder
              responseData: data,
              errorMessage: null
            }
          });
        }

        return data;
      } catch (error) {
        // Log the error
        if (creditResult.success) {
          await supabase.functions.invoke('complete-ai-generation', {
            body: {
              logId: creditResult.remaining, // Using remaining as placeholder
              responseData: null,
              errorMessage: error instanceof Error ? error.message : 'Unknown error'
            }
          });
        }
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onError: (error) => {
      console.error('Food analysis error:', error);
    }
  });

  return {
    analyzeFood: analyzeFood.mutate,
    analyzeFoodAsync: analyzeFood.mutateAsync,
    isAnalyzing: isAnalyzing || analyzeFood.isPending,
    error: analyzeFood.error,
    result: analyzeFood.data,
    reset: analyzeFood.reset
  };
};
