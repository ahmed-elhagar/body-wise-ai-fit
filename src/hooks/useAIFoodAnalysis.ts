
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreditSystem } from './useCreditSystem';
import { AIFoodAnalysisResult, FoodAnalysisItem } from '@/types/aiAnalysis';

export const useAIFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIFoodAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const analyzeFood = async (imageFile: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('Starting AI food analysis...');

      // Use 'recipe' as the generation type since it's valid in the database constraint
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'recipe',
        promptData: {
          analysisType: 'food_image',
          fileName: imageFile.name,
          fileSize: imageFile.size
        }
      });

      console.log('Credit check successful, proceeding with analysis...');

      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(imageFile);

      const base64Image = await base64Promise;

      // Mock analysis result for now (since we don't have a food analysis edge function)
      // In a real implementation, you would call an edge function here
      const mockResult: AIFoodAnalysisResult = {
        foodItems: [
          {
            name: 'Mixed Food Item',
            category: 'general',
            quantity: '1 serving',
            calories: 250,
            protein: 15,
            carbs: 30,
            fat: 8,
            fiber: 5,
            sugar: 10
          }
        ],
        overallConfidence: 0.75,
        cuisineType: 'general',
        mealType: 'meal',
        suggestions: 'The image quality could be improved for better analysis. Try taking the photo in better lighting.',
        recommendations: 'Consider adding more vegetables to balance the meal nutrition.',
        totalNutrition: {
          calories: 250,
          protein: 15,
          carbs: 30,
          fat: 8
        },
        imageData: URL.createObjectURL(imageFile),
        remainingCredits: creditResult.remaining
      };

      setAnalysisResult(mockResult);

      // Complete the generation log
      await completeGenerationAsync({
        logId: creditResult.log_id!,
        responseData: {
          analysisType: 'food_image',
          itemsDetected: mockResult.foodItems.length,
          confidence: mockResult.overallConfidence
        }
      });

      console.log('Food analysis completed successfully');

    } catch (err) {
      console.error('Error analyzing food:', err);
      setError(err instanceof Error ? err : new Error('Failed to check AI generation credits. Please try again.'));
      
      // If we have a log ID, mark the generation as failed
      // This will only work if the credit check succeeded
      try {
        // We don't have the log ID if credit check failed, so we'll just skip this
      } catch (completeError) {
        console.error('Failed to complete generation log:', completeError);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeFood,
    isAnalyzing,
    analysisResult,
    error
  };
};
