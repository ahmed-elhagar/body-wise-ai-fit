
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
        if (!searchTerm || searchTerm.length < 2) {
          console.log('🔍 Search term too short or empty');
          return [];
        }

        console.log('🔍 Searching food items with term:', searchTerm, 'category:', category);

        try {
          // Use the search_food_items function
          const { data, error } = await supabase
            .rpc('search_food_items', { 
              search_term: searchTerm,
              category_filter: category || null,
              limit_count: 20 
            });

          if (error) {
            console.error('❌ Error searching food items via RPC:', error);
            
            // Fallback to direct table query
            console.log('🔄 Falling back to direct table query');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('food_items')
              .select('*')
              .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
              .limit(20);

            if (fallbackError) {
              console.error('❌ Fallback query also failed:', fallbackError);
              throw fallbackError;
            }

            console.log('✅ Fallback query successful, found:', fallbackData?.length || 0, 'items');
            return fallbackData as FoodItem[];
          }

          console.log('✅ RPC search successful, found:', data?.length || 0, 'items');
          return data as FoodItem[];
        } catch (error) {
          console.error('❌ Search error:', error);
          throw error;
        }
      },
      enabled: !!searchTerm && searchTerm.length >= 2,
      staleTime: 30000, // Cache for 30 seconds
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
      console.log('📝 Logging food consumption:', consumption);

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
          consumed_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Error logging food consumption:', error);
        throw error;
      }

      console.log('✅ Food consumption logged successfully');
    },
    onSuccess: () => {
      // Invalidate food consumption queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['food-consumption'] });
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
