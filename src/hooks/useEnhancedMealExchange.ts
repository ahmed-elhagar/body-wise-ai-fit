
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import type { DailyMeal } from '@/features/meal-plan/types';

interface MealAlternative {
  name: string;
  reason: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
}

export const useEnhancedMealExchange = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isExchanging, setIsExchanging] = useState(false);
  const [alternatives, setAlternatives] = useState<MealAlternative[]>([]);

  const generateMealAlternatives = async (meal: any): Promise<boolean> => {
    if (!user || !profile) {
      toast.error('User profile not found');
      return false;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Generating meal alternatives for:', meal.name);

      toast.loading('Finding meal alternatives...', { duration: 15000 });

      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          currentMeal: {
            name: meal.name,
            meal_type: meal.meal_type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            ingredients: meal.ingredients,
            prep_time: meal.prep_time || meal.prepTime,
            cook_time: meal.cook_time || meal.cookTime,
            servings: meal.servings
          },
          userProfile: {
            ...profile,
            dietary_restrictions: profile.dietary_restrictions || [],
            allergies: profile.allergies || [],
            preferred_foods: profile.preferred_foods || []
          },
          userId: user.id,
          alternativesCount: 3
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Error generating alternatives:', error);
        throw error;
      }

      if (data?.success && data.alternatives) {
        console.log('✅ Meal alternatives generated successfully:', data.alternatives);
        setAlternatives(data.alternatives);
        toast.success(`Found ${data.alternatives.length} meal alternatives!`);
        return true;
      } else {
        console.error('❌ Alternative generation failed:', data);
        throw new Error(data?.error || 'Failed to generate alternatives');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating meal alternatives:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to generate meal alternatives');
      return false;
    } finally {
      setIsExchanging(false);
    }
  };

  const exchangeMeal = async (originalMeal: any, selectedAlternative: MealAlternative): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    setIsExchanging(true);
    
    try {
      console.log('🔄 Exchanging meal:', originalMeal.name, 'with:', selectedAlternative.name);

      toast.loading('Exchanging meal...', { duration: 10000 });

      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          mealId: originalMeal.id,
          originalMeal: {
            name: originalMeal.name,
            meal_type: originalMeal.meal_type,
            calories: originalMeal.calories,
            protein: originalMeal.protein,
            carbs: originalMeal.carbs,
            fat: originalMeal.fat
          },
          newMeal: {
            name: selectedAlternative.name,
            calories: selectedAlternative.calories,
            protein: selectedAlternative.protein,
            carbs: selectedAlternative.carbs,
            fat: selectedAlternative.fat,
            ingredients: selectedAlternative.ingredients,
            instructions: selectedAlternative.instructions,
            prep_time: selectedAlternative.prep_time,
            cook_time: selectedAlternative.cook_time,
            servings: selectedAlternative.servings
          },
          userId: user.id,
          reason: selectedAlternative.reason
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Error exchanging meal:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchanged successfully!', data);
        toast.success(`Meal exchanged! ${originalMeal.name} → ${selectedAlternative.name}`);
        setAlternatives([]); // Clear alternatives after successful exchange
        return true;
      } else {
        console.error('❌ Meal exchange failed:', data);
        throw new Error(data?.error || 'Failed to exchange meal');
      }
      
    } catch (error: any) {
      console.error('❌ Error exchanging meal:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to exchange meal');
      return false;
    } finally {
      setIsExchanging(false);
    }
  };

  const clearAlternatives = () => {
    setAlternatives([]);
  };

  return {
    generateMealAlternatives,
    exchangeMeal,
    clearAlternatives,
    isExchanging,
    alternatives
  };
};
