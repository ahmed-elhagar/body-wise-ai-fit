
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DailyMeal } from '@/features/meal-plan/types';

interface MealAlternative {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: any[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  meal_type: string;
  cuisine_type?: string;
  difficulty?: string;
}

export const useEnhancedMealExchange = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isExchanging, setIsExchanging] = useState(false);
  const [alternatives, setAlternatives] = useState<MealAlternative[]>([]);

  const generateMealAlternatives = async (currentMeal: any) => {
    if (!user || !profile) {
      toast.error('User profile required for meal exchange');
      return;
    }

    setIsExchanging(true);
    console.log('🔄 Generating alternatives for meal:', currentMeal.name);

    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          currentMeal: {
            name: currentMeal.name,
            meal_type: currentMeal.meal_type,
            calories: currentMeal.calories,
            protein: currentMeal.protein,
            carbs: currentMeal.carbs,
            fat: currentMeal.fat,
            ingredients: currentMeal.ingredients || []
          },
          userProfile: {
            dietary_restrictions: profile.dietary_restrictions || [],
            allergies: profile.allergies || [],
            preferred_foods: profile.preferred_foods || [],
            fitness_goal: profile.fitness_goal,
            activity_level: profile.activity_level,
            age: profile.age,
            gender: profile.gender,
            weight: profile.weight,
            height: profile.height
          },
          preferences: {
            similar_nutrition: true,
            avoid_allergens: true,
            respect_dietary_restrictions: true,
            target_calories: currentMeal.calories,
            cuisine_variety: true
          }
        }
      });

      if (error) {
        console.error('❌ Alternative generation error:', error);
        throw error;
      }

      if (data?.success && data?.alternatives) {
        console.log('✅ Generated alternatives:', data.alternatives.length);
        setAlternatives(data.alternatives);
        toast.success(`Found ${data.alternatives.length} alternative meals!`);
      } else {
        throw new Error(data?.error || 'Failed to generate alternatives');
      }
    } catch (error: any) {
      console.error('❌ Error generating alternatives:', error);
      toast.error(error.message || 'Failed to generate meal alternatives');
      setAlternatives([]);
    } finally {
      setIsExchanging(false);
    }
  };

  const exchangeMeal = async (currentMeal: any, selectedAlternative: MealAlternative) => {
    if (!user) {
      toast.error('User authentication required');
      return false;
    }

    setIsExchanging(true);
    console.log('🔄 Exchanging meal:', currentMeal.name, 'with:', selectedAlternative.name);

    try {
      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          userId: user.id,
          originalMealId: currentMeal.id,
          newMeal: selectedAlternative,
          exchangeReason: 'user_preference',
          preserveNutrition: true
        }
      });

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchanged successfully');
        toast.success(`Meal exchanged: ${selectedAlternative.name}`);
        setAlternatives([]);
        return true;
      } else {
        throw new Error(data?.error || 'Failed to exchange meal');
      }
    } catch (error: any) {
      console.error('❌ Error exchanging meal:', error);
      toast.error(error.message || 'Failed to exchange meal');
      return false;
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    generateMealAlternatives,
    exchangeMeal,
    isExchanging,
    alternatives
  };
};
