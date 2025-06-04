
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFoodPhotoIntegration = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggingFood, setIsLoggingFood] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePhoto = async (imageFile: File) => {
    return analyzePhotoFood(imageFile);
  };

  const analyzePhotoFood = async (imageFile: File) => {
    if (!user?.id) {
      console.error('No user ID available for photo analysis');
      return null;
    }

    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('📸 Analyzing food photo with AI');
      
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('userId', user.id);

      const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
        body: formData
      });

      if (error) {
        console.error('❌ Food photo analysis error:', error);
        setError(error.message);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Food photo analysis completed successfully:', data);
        setAnalysisResult(data);
        await completeGenerationAsync();
        toast.success('Food photo analyzed successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('❌ Food photo analysis failed:', error);
      setError(error.message);
      toast.error('Failed to analyze food photo');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToFoodItem = (food: any) => {
    console.log('🔄 Converting food item:', food);
    
    // Handle both direct food objects and nested analysis results
    const foodData = food.foodItems ? food.foodItems[0] : food;
    
    const converted = {
      name: foodData?.name || food?.name || 'Unknown Food',
      calories: foodData?.calories || food?.calories || 0,
      protein: foodData?.protein || food?.protein || 0,
      carbs: foodData?.carbs || food?.carbs || 0,
      fat: foodData?.fat || food?.fat || 0,
      quantity: foodData?.quantity || food?.quantity || '1 serving',
      category: foodData?.category || food?.category || 'general',
      confidence: food?.overallConfidence || foodData?.confidence || 0.8
    };
    
    console.log('✅ Converted food item:', converted);
    return converted;
  };

  const logAnalyzedFood = async (food: any, quantity: number, mealType: string, notes: string) => {
    if (!user?.id) {
      console.error('No user ID available for food logging');
      return;
    }

    setIsLoggingFood(true);
    
    try {
      console.log('📝 Logging analyzed food:', food);
      
      const { error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user.id,
          food_item_id: food.id || crypto.randomUUID(),
          quantity_g: quantity,
          calories_consumed: (food.calories || 0) * (quantity / 100),
          protein_consumed: (food.protein || 0) * (quantity / 100),
          carbs_consumed: (food.carbs || 0) * (quantity / 100),
          fat_consumed: (food.fat || 0) * (quantity / 100),
          meal_type: mealType,
          notes: notes,
          source: 'ai_analysis',
          ai_analysis_data: food
        });

      if (error) {
        console.error('❌ Food logging error:', error);
        throw error;
      }

      console.log('✅ Food logged successfully');
      toast.success('Food added to log!');
    } catch (error: any) {
      console.error('❌ Food logging failed:', error);
      toast.error('Failed to log food');
      throw error;
    } finally {
      setIsLoggingFood(false);
    }
  };

  return {
    isAnalyzing,
    isLoggingFood,
    analysisResult,
    error,
    analyzePhoto,
    analyzePhotoFood,
    convertToFoodItem,
    logAnalyzedFood
  };
};
