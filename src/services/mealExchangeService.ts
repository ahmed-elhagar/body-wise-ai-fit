
import { supabase } from '@/integrations/supabase/client';
import type { DailyMeal } from '@/features/meal-plan/types';

export interface MealExchangeRequest {
  mealId: string;
  reason: string;
  preferences?: {
    dietary_restrictions?: string[];
    cuisine_type?: string;
    max_prep_time?: number;
    allergies?: string[];
  };
}

export interface MealAlternative {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: any[];
  instructions: string[];
  image_url?: string;
  similarity_score: number;
  reason: string;
}

export class MealExchangeService {
  private static instance: MealExchangeService;
  
  static getInstance(): MealExchangeService {
    if (!MealExchangeService.instance) {
      MealExchangeService.instance = new MealExchangeService();
    }
    return MealExchangeService.instance;
  }

  async generateAlternatives(request: MealExchangeRequest): Promise<MealAlternative[]> {
    try {
      console.log('🔄 Generating meal alternatives for:', request.mealId);
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId: request.mealId,
          reason: request.reason,
          preferences: request.preferences,
          action: 'generate_alternatives'
        }
      });

      if (error) {
        console.error('❌ Error generating alternatives:', error);
        throw new Error(error.message || 'Failed to generate meal alternatives');
      }

      if (!data?.success || !data?.alternatives) {
        throw new Error('No alternatives generated');
      }

      console.log('✅ Generated alternatives:', data.alternatives.length);
      return data.alternatives;
    } catch (error) {
      console.error('❌ MealExchangeService.generateAlternatives failed:', error);
      throw error;
    }
  }

  async exchangeMeal(mealId: string, alternative: MealAlternative): Promise<boolean> {
    try {
      console.log('🔄 Exchanging meal:', mealId, 'with:', alternative.name);
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId,
          alternative,
          action: 'exchange_meal'
        }
      });

      if (error) {
        console.error('❌ Error exchanging meal:', error);
        throw new Error(error.message || 'Failed to exchange meal');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Meal exchange failed');
      }

      console.log('✅ Meal exchanged successfully');
      return true;
    } catch (error) {
      console.error('❌ MealExchangeService.exchangeMeal failed:', error);
      throw error;
    }
  }

  async quickExchange(mealId: string, reason: string): Promise<DailyMeal> {
    try {
      console.log('🔄 Quick exchange for meal:', mealId);
      
      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          mealId,
          reason,
          action: 'quick_exchange'
        }
      });

      if (error) {
        console.error('❌ Error in quick exchange:', error);
        throw new Error(error.message || 'Quick exchange failed');
      }

      if (!data?.success || !data?.meal) {
        throw new Error('Quick exchange failed');
      }

      console.log('✅ Quick exchange completed');
      return data.meal;
    } catch (error) {
      console.error('❌ MealExchangeService.quickExchange failed:', error);
      throw error;
    }
  }
}
