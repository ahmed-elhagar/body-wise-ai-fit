
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

      const imageBase64 = await convertFileToBase64(file);

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageBase64 }
      });

      if (error) throw error;

      // Log the analysis in ai_generation_logs
      await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: 'food_analysis',
          status: 'completed',
          prompt_data: { imageBase64: '[base64_data]' },
          response_data: data.analysis
        });

      return data.analysis;
    },
    onSuccess: () => {
      toast.success('Food analysis completed!');
    },
    onError: (error) => {
      console.error('Error analyzing food:', error);
      toast.error('Failed to analyze food image');
    },
  });

  return {
    analyzeFood: mutation.mutate,
    isAnalyzing: mutation.isPending,
    analysisResult: mutation.data,
  };
};
