
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

export const useEnhancedFoodAnalysis = () => {
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check AI generation credits
      const { data: creditCheck, error: creditError } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: 'food_analysis',
        prompt_data_param: { imageSize: file.size, fileName: file.name }
      });

      if (creditError) throw creditError;
      
      const creditResult = creditCheck as any;
      if (!creditResult?.success) {
        throw new Error(creditResult?.error || 'AI generation limit reached');
      }

      const imageBase64 = await convertFileToBase64(file);

      try {
        const { data, error } = await supabase.functions.invoke('analyze-food-image', {
          body: { imageBase64, userId: user.id }
        });

        if (error) throw error;

        // Complete the AI generation log
        await supabase.rpc('complete_ai_generation', {
          log_id_param: creditResult.log_id,
          response_data_param: data.analysis
        });

        // Store analyzed food items in the database
        if (data.analysis?.foodItems && Array.isArray(data.analysis.foodItems)) {
          for (const foodItem of data.analysis.foodItems) {
            await supabase
              .from('food_items')
              .upsert({
                name: foodItem.name,
                category: foodItem.category || 'general',
                cuisine_type: data.analysis.cuisineType || 'general',
                calories_per_100g: foodItem.calories || 0,
                protein_per_100g: foodItem.protein || 0,
                carbs_per_100g: foodItem.carbs || 0,
                fat_per_100g: foodItem.fat || 0,
                fiber_per_100g: foodItem.fiber || 0,
                sugar_per_100g: foodItem.sugar || 0,
                serving_size_g: 100,
                serving_description: foodItem.quantity || '100g',
                confidence_score: data.analysis.overallConfidence || 0.7,
                source: 'ai_analysis',
                verified: false
              }, { 
                onConflict: 'name',
                ignoreDuplicates: true 
              });
          }
        }

        return {
          ...data.analysis,
          remainingCredits: creditResult.remaining || 0
        };
      } catch (error) {
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
        toast.success(`Food analysis completed! ${data.remainingCredits} credits remaining.`);
      } else {
        toast.success(`Analysis completed with moderate confidence. ${data.remainingCredits} credits remaining.`);
      }
    },
    onError: (error) => {
      console.error('Error analyzing food:', error);
      if (error.message.includes('limit reached')) {
        toast.error('AI generation limit reached. Please upgrade or wait for credits to reset.');
      } else {
        toast.error('Failed to analyze food image. Please try again.');
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
