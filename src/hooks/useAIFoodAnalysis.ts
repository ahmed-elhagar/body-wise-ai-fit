
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { AIFoodAnalysisResult, FoodAnalysisItem } from '@/types/aiAnalysis';

export const useAIFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIFoodAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const { t } = useLanguage();

  const validateImage = (imageFile: File): boolean => {
    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      setError(new Error(t('Please select a valid image file')));
      return false;
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      setError(new Error(t('Image size must be less than 10MB')));
      return false;
    }

    // Validate minimum size (to avoid tiny images)
    if (imageFile.size < 1024) {
      setError(new Error(t('Image file is too small')));
      return false;
    }

    return true;
  };

  const analyzeFood = async (imageFile: File) => {
    if (!validateImage(imageFile)) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    let creditResult: any = null;

    try {
      console.log('🔍 Starting AI food analysis...');

      // Check and use credits
      creditResult = await checkAndUseCreditAsync({
        generationType: 'food_analysis',
        promptData: {
          analysisType: 'food_image',
          fileName: imageFile.name,
          fileSize: imageFile.size
        }
      });

      console.log('✅ Credit check successful, proceeding with analysis...');

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

      // Call the enhanced AI food analysis edge function
      console.log('🤖 Calling enhanced food analysis edge function...');
      
      const { data: analysisData, error: functionError } = await supabase.functions.invoke('analyze-food-image', {
        body: {
          imageBase64: `data:image/jpeg;base64,${base64Image}`,
          userId: creditResult.user_id || 'anonymous',
          language: 'en', // Add language support
          enhancedAnalysis: true // Flag for enhanced analysis
        }
      });

      if (functionError) {
        console.error('❌ Edge function error:', functionError);
        throw new Error(`${t('Analysis failed')}: ${functionError.message}`);
      }

      if (!analysisData?.success || !analysisData?.analysis) {
        console.error('❌ Analysis failed:', analysisData);
        throw new Error(t('Failed to analyze food image. Please try a clearer photo.'));
      }

      const analysis = analysisData.analysis;

      // Enhanced result processing with validation
      const result: AIFoodAnalysisResult = {
        foodItems: (analysis.foodItems || []).map((item: any) => ({
          name: item.name || t('Unknown Food'),
          category: item.category || 'general',
          cuisine: item.cuisine || 'general',
          calories: Math.max(0, item.calories || 0),
          protein: Math.max(0, item.protein || 0),
          carbs: Math.max(0, item.carbs || 0),
          fat: Math.max(0, item.fat || 0),
          fiber: Math.max(0, item.fiber || 0),
          sugar: Math.max(0, item.sugar || 0),
          quantity: item.quantity || t('estimated portion')
        })),
        overallConfidence: Math.min(1, Math.max(0, analysis.overallConfidence || 0.7)),
        cuisineType: analysis.cuisineType || 'general',
        mealType: analysis.mealType || 'meal',
        suggestions: analysis.suggestions || t('Analysis completed successfully.'),
        recommendations: analysis.recommendations || t('Consider balancing your meal with a variety of nutrients.'),
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
          totalCalories: result.totalNutrition.calories,
          language: 'en'
        }
      });

      console.log('✅ Enhanced food analysis completed successfully');
      toast.success(t('Food analysis completed! {{count}} items detected.', { 
        count: result.foodItems.length 
      }));

    } catch (err) {
      console.error('❌ Error analyzing food:', err);
      const errorMessage = err instanceof Error ? err.message : t('Failed to analyze food image. Please try again.');
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
    error,
    clearError: () => setError(null),
    clearResults: () => setAnalysisResult(null)
  };
};
