
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

  const searchFoodItems = (searchTerm: string, category?: string) => {
    return useQuery({
      queryKey: ['food-search', searchTerm, category],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];

        const { data, error } = await supabase
          .rpc('search_food_items', { 
            search_term: searchTerm,
            category_filter: category,
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

  // Favorites functionality
  const { data: favoriteFoods, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorite-foods', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_favorite_foods')
        .select(`
          *,
          food_item:food_items(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addToFavorites = useMutation({
    mutationFn: async (params: {
      foodItemId: string;
      customName?: string;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('user_favorite_foods')
        .insert({
          user_id: user?.id,
          food_item_id: params.foodItemId,
          custom_name: params.customName,
          notes: params.notes,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-foods', user?.id] });
      toast.success('Added to favorites!');
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    },
  });

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
    favoriteFoods: favoriteFoods || [],
    isLoadingFavorites,
    addToFavorites: addToFavorites.mutate,
    isAddingToFavorites: addToFavorites.isPending,
    logConsumption: logConsumption.mutate,
    isLoggingConsumption: logConsumption.isPending,
  };
};
