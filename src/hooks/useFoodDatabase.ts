
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
          // Use the search_food_items function first
          const { data, error } = await supabase
            .rpc('search_food_items', { 
              search_term: searchTerm,
              category_filter: category || null,
              limit_count: 20 
            });

          if (error) {
            console.error('❌ Error searching food items via RPC:', error);
            
            // Fallback to direct table query with better search
            console.log('🔄 Falling back to direct table query');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('food_items')
              .select('*')
              .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
              .order('verified', { ascending: false })
              .order('confidence_score', { ascending: false })
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
      retry: 1, // Only retry once on failure
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

      const consumedAt = new Date().toISOString();
      console.log('📅 Using consumed_at timestamp:', consumedAt);

      const { data, error } = await supabase
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
          consumed_at: consumedAt
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error logging food consumption:', error);
        throw error;
      }

      console.log('✅ Food consumption logged successfully:', data);
      return data;
    },
    onSuccess: async (data) => {
      console.log('🔄 Food logged successfully, invalidating queries...');
      
      // Immediately clear all food consumption related queries
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('food-consumption') || 
                 queryKey.includes('food-consumption-today');
        }
      });
      
      // Force immediate refetch of active queries
      await queryClient.refetchQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('food-consumption-today');
        },
        type: 'active'
      });
      
      console.log('✅ All queries invalidated and refetched');
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
