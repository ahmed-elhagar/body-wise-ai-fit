
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  cuisine_type: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  serving_size_g: number;
  serving_description?: string;
  confidence_score: number;
  verified: boolean;
  image_url?: string;
}

export const useFoodDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Search food items
  const searchFoodItems = (searchTerm: string, category?: string) => {
    return useQuery({
      queryKey: ['food-search', searchTerm, category],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];
        
        const { data, error } = await supabase.rpc('search_food_items', {
          search_term: searchTerm,
          category_filter: category || null,
          limit_count: 20
        });

        if (error) throw error;

        // Log search history
        if (user?.id && searchTerm.length > 2) {
          await supabase
            .from('food_search_history')
            .insert({
              user_id: user.id,
              search_term: searchTerm,
              search_type: 'text',
              results_count: data?.length || 0
            });
        }

        return (data || []) as FoodItem[];
      },
      enabled: searchTerm.length >= 2,
    });
  };

  // Get user's favorite foods
  const { data: favoriteFoods, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorite-foods', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_favorite_foods')
        .select(`
          id,
          custom_name,
          custom_serving_size_g,
          notes,
          created_at,
          food_item:food_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Add to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async ({ foodItemId, customName, customServingSize, notes }: {
      foodItemId: string;
      customName?: string;
      customServingSize?: number;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_favorite_foods')
        .insert({
          user_id: user.id,
          food_item_id: foodItemId,
          custom_name: customName,
          custom_serving_size_g: customServingSize,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-foods'] });
      toast.success('Added to favorites!');
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    },
  });

  // Remove from favorites
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('user_favorite_foods')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-foods'] });
      toast.success('Removed from favorites');
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    },
  });

  // Log food consumption
  const logConsumptionMutation = useMutation({
    mutationFn: async ({ 
      foodItemId, 
      quantity, 
      mealType, 
      notes,
      calories,
      protein,
      carbs,
      fat
    }: {
      foodItemId: string;
      quantity: number;
      mealType: string;
      notes?: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user.id,
          food_item_id: foodItemId,
          quantity_g: quantity,
          meal_type: mealType,
          calories_consumed: calories,
          protein_consumed: protein,
          carbs_consumed: carbs,
          fat_consumed: fat,
          notes,
          source: 'manual'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption'] });
      toast.success('Food logged successfully!');
    },
    onError: (error) => {
      console.error('Error logging food:', error);
      toast.error('Failed to log food consumption');
    },
  });

  return {
    searchFoodItems,
    favoriteFoods,
    isLoadingFavorites,
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    logConsumption: logConsumptionMutation.mutate,
    isAddingToFavorites: addToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    isLoggingConsumption: logConsumptionMutation.isPending
  };
};
