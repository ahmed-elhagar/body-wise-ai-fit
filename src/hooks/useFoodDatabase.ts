
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
  similarity_score?: number;
}

export const useFoodDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Centralized search using only food_items table
  const searchFoodItems = (searchTerm: string, category?: string) => {
    return useQuery({
      queryKey: ['centralized-food-search', searchTerm, category],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];
        
        // Use the optimized RPC function for centralized search
        const { data, error } = await supabase.rpc('search_food_items', {
          search_term: searchTerm,
          category_filter: category || null,
          limit_count: 20
        });

        if (error) {
          console.error('Centralized food search error:', error);
          return [];
        }

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

        return data || [];
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

  // Add meal to food_items table if it doesn't exist
  const ensureMealInFoodItems = async (meal: any) => {
    // Check if meal already exists in food_items
    const { data: existing, error: checkError } = await supabase
      .from('food_items')
      .select('id')
      .eq('name', meal.name)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing meal:', checkError);
      throw checkError;
    }

    if (existing) {
      return existing.id;
    }

    // Add meal to food_items table
    const { data: newFood, error: insertError } = await supabase
      .from('food_items')
      .insert({
        name: meal.name,
        category: 'meal',
        cuisine_type: 'general',
        calories_per_100g: Math.round((meal.calories || 0) / ((meal.servings || 1) * 100) * 100),
        protein_per_100g: Math.round((meal.protein || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        carbs_per_100g: Math.round((meal.carbs || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        fat_per_100g: Math.round((meal.fat || 0) / ((meal.servings || 1) * 100) * 100 * 10) / 10,
        serving_size_g: 100 * (meal.servings || 1),
        serving_description: `${meal.servings || 1} serving(s)`,
        source: 'meal_plan',
        confidence_score: 0.9,
        verified: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting meal:', insertError);
      throw insertError;
    }

    return newFood.id;
  };

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
      source = 'manual',
      mealData
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
      mealData?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      let actualFoodItemId = foodItemId;

      // If this is a meal from meal plan (has meal- prefix), ensure it exists in food_items
      if (foodItemId.startsWith('meal-') && mealData) {
        try {
          actualFoodItemId = await ensureMealInFoodItems(mealData);
        } catch (error) {
          console.error('Failed to ensure meal in food_items:', error);
          throw new Error('Failed to add meal to database');
        }
      }

      console.log('Logging consumption with actual food ID:', {
        user_id: user.id,
        food_item_id: actualFoodItemId,
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
          food_item_id: actualFoodItemId,
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
    isLoggingConsumption: logConsumptionMutation.isPending,
    ensureMealInFoodItems
  };
};
