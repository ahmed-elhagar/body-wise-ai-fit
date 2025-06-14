
import { useState } from 'react';

export const useFoodPhotoIntegration = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Mock analysis - in real implementation, this would call an AI service
      setTimeout(() => {
        setAnalysisResult({
          name: "Grilled Chicken Breast",
          calories: 231,
          protein: 43.5,
          carbs: 0,
          fat: 5,
          confidence: 0.92
        });
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      setIsAnalyzing(false);
    }
  };

  const logAnalyzedFood = async (food: any, quantity: number, mealType: string, notes: string) => {
    console.log('Logging analyzed food:', { food, quantity, mealType, notes });
    // In real implementation, this would save to the database
  };

  const convertToFoodItem = (aiAnalysis: any) => {
    return {
      id: `ai-${Date.now()}`,
      name: aiAnalysis.name,
      calories_per_100g: aiAnalysis.calories,
      protein_per_100g: aiAnalysis.protein,
      carbs_per_100g: aiAnalysis.carbs,
      fat_per_100g: aiAnalysis.fat,
      category: 'ai_analyzed',
      verified: false,
      serving_description: '100g serving'
    };
  };

  return {
    analysisResult,
    setAnalysisResult,
    isAnalyzing,
    analyzePhoto,
    logAnalyzedFood,
    convertToFoodItem
  };
};
