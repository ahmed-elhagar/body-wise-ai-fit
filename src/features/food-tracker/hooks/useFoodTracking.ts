
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { FoodConsumptionLog, FoodItem } from '../types';

export const useFoodTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch food consumption logs for a specific date
  const {
    data: foodLogs = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['food-consumption', user?.id, selectedDate.toDateString()],
    queryFn: async () => {
      if (!user?.id) return [];

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          *,
          food_item:food_items(*)
        `)
        .eq('user_id', user.id)
        .gte('consumed_at', startOfDay.toISOString())
        .lte('consumed_at', endOfDay.toISOString())
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data as FoodConsumptionLog[];
    },
    enabled: !!user?.id,
  });

  // Add food consumption
  const addFoodMutation = useMutation({
    mutationFn: async (foodData: Partial<FoodConsumptionLog>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_consumption_log')
        .insert({
          ...foodData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['food-consumption', user?.id]
      });
      toast.success('Food added to log successfully');
    },
    onError: (error) => {
      console.error('Error adding food:', error);
      toast.error('Failed to add food to log');
    },
  });

  // Delete food consumption
  const deleteFoodMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('food_consumption_log')
        .delete()
        .eq('id', logId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['food-consumption', user?.id]
      });
      toast.success('Food removed from log');
    },
    onError: (error) => {
      console.error('Error deleting food:', error);
      toast.error('Failed to remove food from log');
    },
  });

  // Calculate nutrition summary
  const nutritionSummary = foodLogs.reduce(
    (summary, log) => ({
      totalCalories: summary.totalCalories + (log.calories_consumed || 0),
      totalProtein: summary.totalProtein + (log.protein_consumed || 0),
      totalCarbs: summary.totalCarbs + (log.carbs_consumed || 0),
      totalFat: summary.totalFat + (log.fat_consumed || 0),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );

  return {
    // Data
    foodLogs,
    nutritionSummary,
    selectedDate,
    
    // State
    isLoading,
    error,
    isAdding: addFoodMutation.isPending,
    isDeleting: deleteFoodMutation.isPending,
    
    // Actions
    setSelectedDate,
    addFoodConsumption: addFoodMutation.mutate,
    deleteFoodConsumption: deleteFoodMutation.mutate,
    refetch,
  };
};
