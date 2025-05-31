
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { toast } from 'sonner';

export const useFoodPhotoIntegration = () => {
  const { user } = useAuth();
  const { useCredit, logGeneration } = useCreditSystem();
  const queryClient = useQueryClient();

  const analyzePhoto = useMutation({
    mutationFn: async (photoFile: File) => {
      // Check and use AI credit
      const creditResult = await new Promise((resolve, reject) => {
        useCredit('food_analysis', {
          onSuccess: resolve,
          onError: reject,
        });
      });

      if (!creditResult || !(creditResult as any).success) {
        throw new Error('Insufficient AI credits');
      }

      // Create form data for photo upload
      const formData = new FormData();
      formData.append('photo', photoFile);

      // Call Supabase Edge Function for analysis
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: formData,
      });

      if (error) {
        // Log failed generation
        logGeneration({
          generationType: 'food_analysis',
          promptData: { fileName: photoFile.name },
          status: 'failed',
          errorMessage: error.message,
        });
        throw error;
      }

      // Log successful generation
      logGeneration({
        generationType: 'food_analysis',
        promptData: { fileName: photoFile.name },
        responseData: data,
        status: 'completed',
      });

      return data;
    },
    onError: (error) => {
      console.error('Photo analysis failed:', error);
      toast.error('Failed to analyze photo');
    },
  });

  const logAnalyzedFood = useMutation({
    mutationFn: async (
      analyzedFood: any,
      quantity: number,
      mealType: string,
      notes: string
    ) => {
      // First, create or find the food item
      let foodItemId = analyzedFood.id;

      if (!foodItemId) {
        const { data: newFoodItem, error: foodError } = await supabase
          .from('food_items')
          .insert({
            name: analyzedFood.name,
            category: 'ai_detected',
            calories_per_100g: analyzedFood.calories || 0,
            protein_per_100g: analyzedFood.protein || 0,
            carbs_per_100g: analyzedFood.carbs || 0,
            fat_per_100g: analyzedFood.fat || 0,
            source: 'ai_analysis',
            confidence_score: analyzedFood.confidence || 0.8,
          })
          .select('id')
          .single();

        if (foodError) throw foodError;
        foodItemId = newFoodItem.id;
      }

      // Log the consumption
      const multiplier = quantity / 100;
      const { error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user?.id,
          food_item_id: foodItemId,
          quantity_g: quantity,
          meal_type: mealType,
          notes,
          calories_consumed: (analyzedFood.calories || 0) * multiplier,
          protein_consumed: (analyzedFood.protein || 0) * multiplier,
          carbs_consumed: (analyzedFood.carbs || 0) * multiplier,
          fat_consumed: (analyzedFood.fat || 0) * multiplier,
          source: 'ai_analysis',
          ai_analysis_data: analyzedFood,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption-today'] });
      toast.success('Food logged successfully!');
    },
    onError: (error) => {
      console.error('Error logging analyzed food:', error);
      toast.error('Failed to log food');
    },
  });

  const convertToFoodItem = (analyzedFood: any) => {
    return {
      id: analyzedFood.id || null,
      name: analyzedFood.name || 'Unknown Food',
      category: 'ai_detected',
      calories: analyzedFood.calories || 0,
      protein: analyzedFood.protein || 0,
      carbs: analyzedFood.carbs || 0,
      fat: analyzedFood.fat || 0,
      quantity: analyzedFood.quantity || 'estimated portion',
      confidence: analyzedFood.confidence || 0.8,
    };
  };

  return {
    analyzePhoto: analyzePhoto.mutate,
    logAnalyzedFood: logAnalyzedFood.mutate,
    convertToFoodItem,
    isAnalyzing: analyzePhoto.isPending,
    isLoggingFood: logAnalyzedFood.isPending,
  };
};
