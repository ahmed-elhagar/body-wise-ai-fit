
import { useState } from 'react';
import { toast } from 'sonner';

export const useFoodPhotoIntegration = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = {
        name: "Grilled Chicken Breast",
        calories: 231,
        protein: 43.5,
        carbs: 0,
        fat: 5,
        confidence: 0.92
      };
      setAnalysisResult(mockResult);
      return mockResult;
    } catch (error) {
      toast.error('Failed to analyze photo');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const logAnalyzedFood = async (foodData: any) => {
    try {
      console.log('Logging analyzed food:', foodData);
      toast.success('Food logged successfully');
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
    }
  };

  const convertToFoodItem = (aiAnalysis: any) => {
    return {
      id: `ai-${Date.now()}`,
      name: aiAnalysis.name,
      calories_per_100g: aiAnalysis.calories,
      protein_per_100g: aiAnalysis.protein,
      carbs_per_100g: aiAnalysis.carbs,
      fat_per_100g: aiAnalysis.fat,
      category: 'general',
      verified: false,
      serving_description: '1 serving'
    };
  };

  return {
    analysisResult,
    setAnalysisResult,
    convertToFoodItem,
    analyzePhoto,
    isAnalyzing,
    logAnalyzedFood
  };
};
