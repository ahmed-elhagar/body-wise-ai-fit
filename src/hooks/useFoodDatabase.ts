
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
  source: string;
  ingredients?: any[];
  instructions?: any[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  created_by_user_id?: string;
  similarity_score?: number;
}

export const useFoodDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Enhanced search that looks in both food_items and food_database tables
  const searchFoodItems = (searchTerm: string, category?: string) => {
    return useQuery({
      queryKey: ['comprehensive-food-search', searchTerm, category],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];
        
        // Search in food_items table (where AI-generated meals are stored)
        const { data: foodItemsData, error: foodItemsError } = await supabase
          .from('food_items')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .order('confidence_score', { ascending: false })
          .limit(15);

        if (foodItemsError) {
          console.error('Food items search error:', foodItemsError);
        }

        // Search in food_database table using the RPC function
        const { data: rpcData, error: rpcError } = await supabase.rpc('search_food_items', {
          search_term: searchTerm,
          category_filter: category || null,
          limit_count: 10
        });

        if (rpcError) {
          console.error('RPC search error:', rpcError);
        }

        // Combine results
        const combinedResults: FoodItem[] = [];

        // Add food_items results
        if (foodItemsData) {
          combinedResults.push(...foodItemsData.map(item => ({
            ...item,
            similarity_score: 1.0 // High score for direct matches
          } as FoodItem)));
        }

        // Add RPC results if they exist
        if (rpcData) {
          combinedResults.push(...rpcData.map(item => ({
            ...item,
            similarity_score: item.similarity_score || 0.8
          } as FoodItem)));
        }

        // Remove duplicates based on name (case insensitive)
        const uniqueResults = combinedResults.filter((item, index, self) => 
          index === self.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
        );

        // Log search history
        if (user?.id && searchTerm.length > 2) {
          await supabase
            .from('food_search_history')
            .insert({
              user_id: user.id,
              search_term: searchTerm,
              search_type: 'text',
              results_count: uniqueResults.length
            });
        }

        // Sort by similarity score and verified status
        return uniqueResults.sort((a, b) => {
          if (a.verified !== b.verified) return a.verified ? -1 : 1;
          return (b.similarity_score || 0) - (a.similarity_score || 0);
        });
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

      if (error) {
        console.error('Favorites error:', error);
        throw error;
      }
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

      if (error) {
        console.error('Add to favorites error:', error);
        throw error;
      }
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

      if (error) {
        console.error('Remove from favorites error:', error);
        throw error;
      }
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
      fat,
      source = 'manual'
    }: {
      foodItemId: string;
      quantity: number;
      mealType: string;
      notes?: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      source?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Logging consumption:', {
        user_id: user.id,
        food_item_id: foodItemId,
        quantity_g: quantity,
        meal_type: mealType,
        calories_consumed: calories,
        protein_consumed: protein,
        carbs_consumed: carbs,
        fat_consumed: fat,
        notes,
        source
      });

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
          source
        })
        .select()
        .single();

      if (error) {
        console.error('Log consumption error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption'] });
      queryClient.invalidateQueries({ queryKey: ['food-consumption-today'] });
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
