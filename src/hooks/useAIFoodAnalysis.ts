
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { toast } from 'sonner';
import { AIFoodAnalysisResult } from '@/types/aiAnalysis';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const useAIFoodAnalysis = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCreditSystem();

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<AIFoodAnalysisResult> => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Starting AI food analysis...');

      // Use centralized credit system
      return new Promise((resolve, reject) => {
        checkAndUseCredit({
          generationType: 'food_analysis',
          promptData: { 
            type: 'food_analysis',
            imageSize: file.size, 
            fileName: file.name 
          }
        }, {
          onSuccess: async (creditResult) => {
            try {
              console.log('Credits checked, proceeding with analysis...');

              const imageBase64 = await convertFileToBase64(file);

              console.log('Calling analyze-food-image function...');
              
              const { data, error } = await supabase.functions.invoke('analyze-food-image', {
                body: { imageBase64, userId: user.id }
              });

              if (error) {
                console.error('Function invoke error:', error);
                throw new Error(`Analysis failed: ${error.message}`);
              }

              if (!data || !data.success) {
                throw new Error(data?.error || 'Analysis failed');
              }

              console.log('Analysis response:', data);

              // Complete the AI generation log with success
              completeGeneration({
                logId: creditResult.log_id!,
                responseData: data.analysis || data
              });

              const result: AIFoodAnalysisResult = {
                ...(data.analysis || data),
                remainingCredits: (creditResult.remaining || 0)
              };

              resolve(result);
            } catch (error) {
              console.error('Analysis error:', error);
              
              // Mark generation as failed
              completeGeneration({
                logId: creditResult.log_id!,
                errorMessage: error instanceof Error ? error.message : 'Analysis failed'
              });
              
              reject(error);
            }
          },
          onError: (error) => {
            reject(error);
          }
        });
      });
    },
    onSuccess: (data: AIFoodAnalysisResult) => {
      const confidence = data.overallConfidence || 0.8;
      if (confidence > 0.7) {
        toast.success(`High-confidence analysis complete! ${data.remainingCredits} credits remaining.`);
      } else {
        toast.success(`Analysis complete (moderate confidence). ${data.remainingCredits} credits remaining.`);
      }
    },
    onError: (error) => {
      console.error('Error analyzing food:', error);
      if (error.message.includes('limit reached')) {
        toast.error('AI generation limit reached. Please upgrade or wait for credits to reset.');
      } else {
        toast.error(`Failed to analyze food image: ${error.message}`);
      }
    },
  });

  return {
    analyzeFood: mutation.mutate,
    isAnalyzing: mutation.isPending,
    analysisResult: mutation.data,
    error: mutation.error
  };
};
