
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreditSystem } from './useCreditSystem';
import { toast } from 'sonner';

export const useAIFoodAnalysis = () => {
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const analyzeFood = useMutation({
    mutationFn: async (imageFile: File) => {
      setError(null);
      
      // Check and use AI credit
      const creditResult = await checkAndUseCreditAsync('food_analysis');

      if (!creditResult || !creditResult.success) {
        throw new Error('Insufficient AI credits');
      }

      // Create form data for photo upload
      const formData = new FormData();
      formData.append('photo', imageFile);

      // Call Supabase Edge Function for analysis
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: formData,
      });

      if (error) {
        // Log failed generation
        await completeGenerationAsync({
          generationType: 'food_analysis',
          promptData: { fileName: imageFile.name },
          status: 'failed',
          errorMessage: error.message,
        });
        throw error;
      }

      // Log successful generation
      await completeGenerationAsync({
        generationType: 'food_analysis',
        promptData: { fileName: imageFile.name },
        responseData: data,
        status: 'completed',
      });

      setAnalysisResult(data);
      return data;
    },
    onError: (error: Error) => {
      console.error('Food analysis failed:', error);
      setError(error);
      toast.error('Failed to analyze food image');
    },
  });

  return {
    analyzeFood: analyzeFood.mutate,
    isAnalyzing: analyzeFood.isPending,
    analysisResult,
    error,
  };
};
