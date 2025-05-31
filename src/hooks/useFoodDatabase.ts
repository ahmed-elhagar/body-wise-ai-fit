
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  serving_description?: string;
  verified?: boolean;
}

export const useFoodDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const searchFoodItems = (searchTerm: string) => {
    return useQuery({
      queryKey: ['food-search', searchTerm],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];

        const { data, error } = await supabase
          .rpc('search_food_items', { 
            search_term: searchTerm,
            limit_count: 20 
          });

        if (error) {
          console.error('Error searching food items:', error);
          throw error;
        }

        return data as FoodItem[];
      },
      enabled: !!searchTerm && searchTerm.length >= 2,
    });
  };

  const logConsumption = useMutation({
    mutationFn: async (consumption: {
      foodItemId: string;
      quantity: number;
      mealType: string;
      notes?: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      source: string;
    }) => {
      const { error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user?.id,
          food_item_id: consumption.foodItemId,
          quantity_g: consumption.quantity,
          meal_type: consumption.mealType,
          notes: consumption.notes,
          calories_consumed: consumption.calories,
          protein_consumed: consumption.protein,
          carbs_consumed: consumption.carbs,
          fat_consumed: consumption.fat,
          source: consumption.source,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption-today'] });
      toast.success('Food logged successfully!');
    },
    onError: (error) => {
      console.error('Error logging food consumption:', error);
      toast.error('Failed to log food consumption');
    },
  });

  return {
    searchFoodItems,
    logConsumption: logConsumption.mutate,
    isLoggingConsumption: logConsumption.isPending,
  };
};
