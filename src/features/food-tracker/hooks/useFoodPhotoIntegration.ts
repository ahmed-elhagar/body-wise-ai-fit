import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFoodPhotoIntegration = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
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

    const creditResult = await checkAndUseCredit('food-photo-analysis');
    if (!creditResult.success) {
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

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
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
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId);
        }
        
        toast.success('Food photo analyzed successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('❌ Food photo analysis failed:', error);
      setError(error.message);
      toast.error('Failed to analyze food photo');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId);
      }
      
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
      throw new Error('User not authenticated');
    }

    setIsLoggingFood(true);
    
    try {
      console.log('📝 Logging analyzed food:', { food, quantity, mealType, notes });
      
      // First, create or get the food item
      const foodItemId = crypto.randomUUID();
      
      // Insert into food_items table
      const { error: foodItemError } = await supabase
        .from('food_items')
        .insert({
          id: foodItemId,
          name: food.name || 'Unknown Food',
          category: food.category || 'general',
          calories_per_100g: food.calories || 0,
          protein_per_100g: food.protein || 0,
          carbs_per_100g: food.carbs || 0,
          fat_per_100g: food.fat || 0,
          source: 'ai_analysis',
          confidence_score: food.confidence || 0.8
        });

      if (foodItemError) {
        console.error('❌ Food item creation error:', foodItemError);
      }

      // Calculate consumption values based on quantity
      const multiplier = quantity / 100;
      const caloriesConsumed = (food.calories || 0) * multiplier;
      const proteinConsumed = (food.protein || 0) * multiplier;
      const carbsConsumed = (food.carbs || 0) * multiplier;
      const fatConsumed = (food.fat || 0) * multiplier;

      // Insert into food_consumption_log table
      const { data: logData, error: logError } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user.id,
          food_item_id: foodItemId,
          quantity_g: quantity,
          calories_consumed: caloriesConsumed,
          protein_consumed: proteinConsumed,
          carbs_consumed: carbsConsumed,
          fat_consumed: fatConsumed,
          meal_type: mealType,
          notes: notes,
          source: 'ai_analysis',
          ai_analysis_data: food,
          consumed_at: new Date().toISOString()
        })
        .select();

      if (logError) {
        console.error('❌ Food consumption logging error:', logError);
        throw logError;
      }

      console.log('✅ Food logged successfully:', logData);
      toast.success('Food added to log!');
      return logData;
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
