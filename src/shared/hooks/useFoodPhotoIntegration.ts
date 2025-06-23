
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCentralizedCredits } from './useCentralizedCredits';

export interface FoodPhotoResult {
  foodName: string;
  calories: number;
  confidence: number;
  nutrients?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const useFoodPhotoIntegration = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodPhotoResult | null>(null);
  const { checkAndUseCredits } = useCentralizedCredits();

  const analyzePhoto = useMutation({
    mutationFn: async (imageFile: File): Promise<FoodPhotoResult> => {
      setIsAnalyzing(true);
      
      try {
        // Check credits first
        const creditResult = await checkAndUseCredits('food-photo-analysis');

        if (!creditResult.success) {
          throw new Error(creditResult.error || 'Insufficient credits');
        }

        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        // Mock analysis result for now
        const mockResult: FoodPhotoResult = {
          foodName: 'Apple',
          calories: 95,
          confidence: 0.85,
          nutrients: {
            protein: 0.5,
            carbs: 25,
            fat: 0.3
          }
        };

        setAnalysisResult(mockResult);
        return mockResult;
      } catch (error) {
        console.error('Food photo analysis error:', error);
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: (result) => {
      toast.success(`Detected: ${result.foodName} (${result.calories} cal)`);
    },
    onError: (error) => {
      toast.error('Failed to analyze photo');
      console.error('Photo analysis error:', error);
    }
  });

  const logAnalyzedFood = async (food: FoodPhotoResult, quantity: number, mealType: string, notes: string) => {
    // Mock implementation for now
    console.log('Logging food:', { food, quantity, mealType, notes });
    toast.success('Food logged successfully!');
  };

  return {
    analyzePhoto: analyzePhoto.mutate,
    analyzePhotoAsync: analyzePhoto.mutateAsync,
    isAnalyzing: isAnalyzing || analyzePhoto.isPending,
    result: analyzePhoto.data,
    analysisResult,
    error: analyzePhoto.error,
    reset: analyzePhoto.reset,
    logAnalyzedFood
  };
};
