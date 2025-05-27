
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

      // Save to database
      const { error: saveError } = await supabase
        .from('ai_food_analysis')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          food_items: data.analysis.foodItems,
          total_calories: data.analysis.totalNutrition.calories,
          analysis_confidence: data.analysis.confidence
        });

      if (saveError) throw saveError;

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
