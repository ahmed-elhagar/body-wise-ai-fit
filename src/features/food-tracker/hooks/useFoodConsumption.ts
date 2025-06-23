
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

export interface FoodConsumptionEntry {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  notes?: string;
  source: 'manual' | 'ai_analysis' | 'barcode';
  food_item?: {
    id: string;
    name: string;
    brand?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    category: string;
  };
}

export const useFoodConsumption = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get today's consumption
  const { 
    data: todayConsumption, 
    isLoading: isLoadingToday, 
    error: todayError,
    refetch: refetchToday 
  } = useQuery({
    queryKey: ['food-consumption-today', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const today = new Date().toISOString().split('T')[0];
      const startDate = `${today}T00:00:00.000Z`;
      const endDate = `${today}T23:59:59.999Z`;

      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          id,
          user_id,
          food_item_id,
          quantity_g,
          calories_consumed,
          protein_consumed,
          carbs_consumed,
          fat_consumed,
          meal_type,
          consumed_at,
          notes,
          source,
          food_item:food_items (
            id,
            name,
            brand,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g,
            category
          )
        `)
        .eq('user_id', user.id)
        .gte('consumed_at', startDate)
        .lte('consumed_at', endDate)
        .order('consumed_at', { ascending: false });

      if (error) {
        console.error('Error fetching today consumption:', error);
        throw error;
      }

      return data as FoodConsumptionEntry[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  // Get consumption history (last 30 days)
  const { 
    data: consumptionHistory, 
    isLoading: isLoadingHistory,
    error: historyError 
  } = useQuery({
    queryKey: ['food-consumption-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          id,
          user_id,
          food_item_id,
          quantity_g,
          calories_consumed,
          protein_consumed,
          carbs_consumed,
          fat_consumed,
          meal_type,
          consumed_at,
          notes,
          source,
          food_item:food_items (
            id,
            name,
            brand,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g,
            category
          )
        `)
        .eq('user_id', user.id)
        .gte('consumed_at', thirtyDaysAgo.toISOString())
        .order('consumed_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching consumption history:', error);
        throw error;
      }

      return data as FoodConsumptionEntry[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Add new food consumption
  const addConsumptionMutation = useMutation({
    mutationFn: async (newEntry: Omit<FoodConsumptionEntry, 'id' | 'user_id' | 'food_item'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user.id,
          ...newEntry,
          consumed_at: newEntry.consumed_at || new Date().toISOString()
        })
        .select(`
          id,
          user_id,
          food_item_id,
          quantity_g,
          calories_consumed,
          protein_consumed,
          carbs_consumed,
          fat_consumed,
          meal_type,
          consumed_at,
          notes,
          source,
          food_item:food_items (
            id,
            name,
            brand,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g,
            category
          )
        `)
        .single();

      if (error) {
        console.error('Error adding food consumption:', error);
        throw error;
      }

      return data as FoodConsumptionEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption-today'] });
      queryClient.invalidateQueries({ queryKey: ['food-consumption-history'] });
      toast.success('Food logged successfully!');
    },
    onError: (error) => {
      console.error('Failed to add food consumption:', error);
      toast.error('Failed to log food');
    }
  });

  // Delete consumption entry
  const deleteConsumptionMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('food_consumption_log')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption-today'] });
      queryClient.invalidateQueries({ queryKey: ['food-consumption-history'] });
      toast.success('Food entry deleted');
    },
    onError: (error) => {
      console.error('Failed to delete food consumption:', error);
      toast.error('Failed to delete food entry');
    }
  });

  const refreshConsumption = () => {
    refetchToday();
    queryClient.invalidateQueries({ queryKey: ['food-consumption-history'] });
  };

  return {
    // Today's data
    todayConsumption,
    isLoading: isLoadingToday,
    error: todayError,
    
    // History data
    consumptionHistory,
    isLoadingHistory,
    historyError,
    
    // Mutations
    addConsumption: addConsumptionMutation.mutate,
    isAddingConsumption: addConsumptionMutation.isPending,
    deleteConsumption: deleteConsumptionMutation.mutate,
    isDeletingConsumption: deleteConsumptionMutation.isPending,
    
    // Utilities
    refreshConsumption,
  };
};
