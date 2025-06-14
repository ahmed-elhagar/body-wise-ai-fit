
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FoodEntry {
  id?: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  meal_type: string;
  notes?: string;
  logged_at: string;
}

export const useFoodTracking = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logFood = useCallback(async (foodEntry: Omit<FoodEntry, 'id' | 'logged_at'>) => {
    if (!user) {
      toast.error('You must be logged in to track food');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('food_consumption')
        .insert({
          user_id: user.id,
          ...foodEntry,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Food logged successfully');
      return true;
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getFoodEntries = useCallback(async (date: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('food_consumption')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', `${date}T00:00:00`)
        .lte('logged_at', `${date}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching food entries:', error);
      return [];
    }
  }, [user]);

  return {
    logFood,
    getFoodEntries,
    isLoading,
  };
};
