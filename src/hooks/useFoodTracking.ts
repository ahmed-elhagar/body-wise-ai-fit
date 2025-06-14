
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FoodEntry {
  id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  logged_at: string;
  notes?: string;
  source: 'manual' | 'ai_analysis' | 'barcode';
  food_item?: {
    name: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
  };
}

export const useFoodTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get food entries for a specific date
  const getFoodEntries = useCallback(async (date: string) => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          *,
          food_items (
            name,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g
          )
        `)
        .eq('user_id', user.id)
        .gte('consumed_at', `${date}T00:00:00.000Z`)
        .lt('consumed_at', `${date}T23:59:59.999Z`)
        .order('consumed_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching food entries:', error);
      return [];
    }
  }, [user?.id]);

  // Log food consumption
  const logFood = useCallback(async (foodEntry: Omit<FoodEntry, 'id' | 'logged_at'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to track food');
      return false;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user.id,
          ...foodEntry,
          logged_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Food logged successfully');
      queryClient.invalidateQueries({ queryKey: ['food-entries'] });
      return true;
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, queryClient]);

  // Add food consumption (alias for compatibility)
  const addFoodConsumption = logFood;

  return {
    logFood,
    addFoodConsumption,
    getFoodEntries,
    isLoading,
    isAdding: isLoading
  };
};
