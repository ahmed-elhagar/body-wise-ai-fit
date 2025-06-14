
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FoodAnalysisResult, ImageAnalysisResponse } from '@/types/aiAnalysis';

export const useEnhancedFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFoodImage = useCallback(async (imageFile: File): Promise<ImageAnalysisResponse | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate AI analysis - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: ImageAnalysisResponse = {
        success: true,
        results: [{
          food_name: imageFile.name.split('.')[0] || 'Unknown Food',
          confidence: 0.85,
          nutrition: {
            calories: 250,
            protein: 15,
            carbs: 30,
            fat: 12,
            fiber: 5,
            sugar: 8,
            sodium: 300
          },
          portion_size: '1 serving',
          ingredients: ['Main ingredient', 'Secondary ingredient'],
          allergens: [],
          dietary_tags: ['healthy']
        }],
        processing_time: 2000
      };

      setAnalysisResult(mockResult);
      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzePhotoFood = analyzeFoodImage; // Alias for backward compatibility

  const convertToFoodItem = useCallback((result: FoodAnalysisResult) => {
    return {
      name: result.food_name,
      calories: result.nutrition.calories,
      protein: result.nutrition.protein,
      carbs: result.nutrition.carbs,
      fat: result.nutrition.fat,
      confidence: result.confidence
    };
  }, []);

  const reset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    analyzeFoodImage,
    analyzePhotoFood,
    convertToFoodItem,
    isAnalyzing,
    analysisResult,
    error,
    reset
  };
};
