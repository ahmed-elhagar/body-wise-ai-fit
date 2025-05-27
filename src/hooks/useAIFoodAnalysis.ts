
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useAIFoodAnalysis = () => {
  const { user } = useAuth();

  const analyzeFood = useMutation({
    mutationFn: async ({ imageBase64, imageUrl }: { imageBase64?: string; imageUrl?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageBase64, imageUrl }
      });

      if (error) throw error;

      // Log the analysis in ai_generation_logs
      await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: 'food_analysis',
          status: 'completed',
          prompt_data: { imageUrl, imageBase64: imageBase64 ? '[base64_data]' : null },
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
    analyzeFood: analyzeFood.mutate,
    isAnalyzing: analyzeFood.isPending,
  };
};
