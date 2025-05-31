
import { useState } from 'react';
import { useFoodDatabase } from './useFoodDatabase';
import { useAIFoodAnalysis } from './useAIFoodAnalysis';
import { AIFoodAnalysisResult, FoodAnalysisItem } from '@/types/aiAnalysis';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useFoodPhotoIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AIFoodAnalysisResult | null>(null);
  
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  const { analyzeFood, isAnalyzing, analysisResult, error } = useAIFoodAnalysis();
  const { t } = useLanguage();

  const processImageAndLog = async (
    imageFile: File, 
    mealType: string = 'snack',
    notes?: string
  ) => {
    setIsProcessing(true);
    
    try {
      // First, analyze the image
      await analyzeFood(imageFile);
      
      // The analysis result will be available through the hook
      // We'll handle logging in a separate method
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(t('Failed to process image. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const logAnalyzedFood = async (
    food: FoodAnalysisItem,
    quantity: number = 100,
    mealType: string = 'snack',
    notes?: string
  ) => {
    try {
      const multiplier = quantity / 100;
      
      const logData = {
        foodItemId: `ai-${Date.now()}`, // Temporary ID for AI-detected foods
        quantity,
        mealType,
        notes: notes || `AI detected: ${food.quantity || 'estimated portion'}`,
        calories: (food.calories || 0) * multiplier,
        protein: (food.protein || 0) * multiplier,
        carbs: (food.carbs || 0) * multiplier,
        fat: (food.fat || 0) * multiplier,
        source: 'ai_analysis',
        mealData: {
          name: food.name,
          category: food.category,
          confidence: analysisResult?.overallConfidence || 0.8,
          originalAnalysis: food
        }
      };

      await logConsumption(logData);
      
      toast.success(t('Food logged successfully!'));
      return true;
      
    } catch (error) {
      console.error('Error logging analyzed food:', error);
      toast.error(t('Failed to log food. Please try again.'));
      return false;
    }
  };

  const convertToFoodItem = (food: FoodAnalysisItem) => {
    // Convert AI analysis result to standardized food item format
    return {
      id: `ai-${Date.now()}`,
      name: food.name,
      category: food.category || 'general',
      calories_per_100g: food.calories || 0,
      protein_per_100g: food.protein || 0,
      carbs_per_100g: food.carbs || 0,
      fat_per_100g: food.fat || 0,
      fiber_per_100g: food.fiber || 0,
      sugar_per_100g: food.sugar || 0,
      serving_size_g: 100,
      serving_description: food.quantity || '100g serving',
      confidence_score: analysisResult?.overallConfidence || 0.8,
      verified: false,
      source: 'ai_scan',
      // Include original analysis data
      _aiAnalysis: food
    };
  };

  const bulkLogFoods = async (
    foods: FoodAnalysisItem[],
    mealType: string = 'meal',
    notes?: string
  ) => {
    let successCount = 0;
    
    for (const food of foods) {
      const success = await logAnalyzedFood(food, 100, mealType, notes);
      if (success) successCount++;
    }
    
    if (successCount === foods.length) {
      toast.success(t('All foods logged successfully!'));
    } else if (successCount > 0) {
      toast.success(t('{{count}} foods logged successfully', { count: successCount }));
    } else {
      toast.error(t('Failed to log foods. Please try again.'));
    }
    
    return successCount;
  };

  return {
    // Core functionality
    processImageAndLog,
    logAnalyzedFood,
    bulkLogFoods,
    convertToFoodItem,
    
    // State
    isProcessing: isProcessing || isAnalyzing,
    isLoggingFood: isLoggingConsumption,
    lastAnalysis: analysisResult || lastAnalysis,
    analysisError: error,
    
    // Direct hook access for more control
    analyzeFood,
    isAnalyzing,
    analysisResult,
    error
  };
};
