
import { useState, useCallback } from 'react';
import { useEnhancedFoodAnalysis } from './useEnhancedFoodAnalysis';
import { useFoodTracking } from './useFoodTracking';
import { toast } from 'sonner';

export const useFoodPhotoIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { analyzeFoodImage } = useEnhancedFoodAnalysis();
  const { logFood } = useFoodTracking();

  const processAndLogFood = useCallback(async (
    imageFile: File,
    mealType: string = 'snack'
  ) => {
    setIsProcessing(true);
    try {
      const analysisResult = await analyzeFoodImage(imageFile);
      
      if (analysisResult && analysisResult.results.length > 0) {
        const primaryResult = analysisResult.results[0];
        
        const foodEntry = {
          food_name: primaryResult.food_name,
          calories: primaryResult.nutrition.calories,
          protein: primaryResult.nutrition.protein,
          carbs: primaryResult.nutrition.carbs,
          fat: primaryResult.nutrition.fat,
          quantity: 100, // Default quantity
          meal_type: mealType,
          notes: `Analyzed from photo (${Math.round(primaryResult.confidence * 100)}% confidence)`
        };

        const success = await logFood(foodEntry);
        if (success) {
          toast.success(`${primaryResult.food_name} added to your food log`);
          return { success: true, foodEntry, analysis: analysisResult };
        }
      }
      
      return { success: false, error: 'Failed to analyze food image' };
    } catch (error) {
      console.error('Error processing food photo:', error);
      toast.error('Failed to process food photo');
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeFoodImage, logFood]);

  return {
    processAndLogFood,
    isProcessing,
  };
};
