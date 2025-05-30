
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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

    let creditResult: any = null;

    try {
      console.log('Starting AI food analysis...');

      // Use 'meal_plan' as the generation type since it's definitely valid in the database constraint
      creditResult = await checkAndUseCreditAsync({
        generationType: 'meal_plan',
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

      // Call the actual AI food analysis edge function
      console.log('Calling food analysis edge function...');
      
      const { data: analysisData, error: functionError } = await supabase.functions.invoke('analyze-food-image', {
        body: {
          imageBase64: `data:image/jpeg;base64,${base64Image}`,
          userId: creditResult.user_id || 'anonymous'
        }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Analysis failed: ${functionError.message}`);
      }

      if (!analysisData?.success || !analysisData?.analysis) {
        console.error('Analysis failed:', analysisData);
        throw new Error('Failed to analyze food image');
      }

      const analysis = analysisData.analysis;

      // Transform the analysis result to match our interface
      const result: AIFoodAnalysisResult = {
        foodItems: analysis.foodItems || [],
        overallConfidence: analysis.overallConfidence || 0.8,
        cuisineType: analysis.cuisineType || 'general',
        mealType: analysis.mealType || 'meal',
        suggestions: analysis.suggestions || 'Analysis completed successfully.',
        recommendations: analysis.recommendations || 'Consider balancing your meal with a variety of nutrients.',
        totalNutrition: {
          calories: analysis.foodItems?.reduce((sum: number, item: any) => sum + (item.calories || 0), 0) || 0,
          protein: analysis.foodItems?.reduce((sum: number, item: any) => sum + (item.protein || 0), 0) || 0,
          carbs: analysis.foodItems?.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0) || 0,
          fat: analysis.foodItems?.reduce((sum: number, item: any) => sum + (item.fat || 0), 0) || 0
        },
        imageData: URL.createObjectURL(imageFile),
        remainingCredits: creditResult.remaining
      };

      setAnalysisResult(result);

      // Complete the generation log
      await completeGenerationAsync({
        logId: creditResult.log_id!,
        responseData: {
          analysisType: 'food_image',
          itemsDetected: result.foodItems.length,
          confidence: result.overallConfidence,
          totalCalories: result.totalNutrition.calories
        }
      });

      console.log('Food analysis completed successfully');
      toast.success(`Food analysis completed! ${result.foodItems.length} items detected.`);

    } catch (err) {
      console.error('Error analyzing food:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze food image. Please try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      
      // If we have a log ID, mark the generation as failed
      if (creditResult?.log_id) {
        try {
          await completeGenerationAsync({
            logId: creditResult.log_id,
            responseData: null,
            errorMessage: errorMessage
          });
        } catch (completeError) {
          console.error('Failed to complete generation log:', completeError);
        }
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
