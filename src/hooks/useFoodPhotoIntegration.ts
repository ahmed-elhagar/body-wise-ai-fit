
import { useState } from 'react';

export const useFoodPhotoIntegration = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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
    convertToFoodItem
  };
};
