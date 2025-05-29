
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Starting AI food analysis...');

      // Check AI generation credits first - using correct generation type
      const { data: creditCheck, error: creditError } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: 'ai_chat', // Using existing constraint value
        prompt_data_param: { 
          type: 'food_analysis',
          imageSize: file.size, 
          fileName: file.name 
        }
      });

      if (creditError) {
        console.error('Credit check error:', creditError);
        throw new Error('Failed to check AI generation credits');
      }
      
      const creditResult = creditCheck as any;
      if (!creditResult?.success) {
        throw new Error(creditResult?.error || 'AI generation limit reached');
      }

      console.log('Credits checked, proceeding with analysis...');

      const imageBase64 = await convertFileToBase64(file);

      try {
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
        await supabase.rpc('complete_ai_generation', {
          log_id_param: creditResult.log_id,
          response_data_param: data.analysis || data
        });

        return {
          ...(data.analysis || data),
          remainingCredits: (creditResult.remaining || 0) - 1
        };
      } catch (error) {
        console.error('Analysis error:', error);
        
        // Mark generation as failed
        await supabase.rpc('complete_ai_generation', {
          log_id_param: creditResult.log_id,
          error_message_param: error instanceof Error ? error.message : 'Analysis failed'
        });
        throw error;
      }
    },
    onSuccess: (data) => {
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
