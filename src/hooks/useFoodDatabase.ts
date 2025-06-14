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
      queryKey: ['food-search', searchTerm, category, user?.id],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) {
          console.log('🔍 Search term too short or empty');
          return [];
        }

        console.log('🔍 Searching food items with term:', searchTerm, 'category:', category);

        try {
          // Search in food_items table first
          const { data: foodItems, error: foodError } = await supabase
            .rpc('search_food_items', { 
              search_term: searchTerm,
              category_filter: category || null,
              limit_count: 15 
            });

          let allResults = [];

          if (foodError) {
            console.error('❌ Error searching food items via RPC:', foodError);
            
            // Fallback to direct table query
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('food_items')
              .select('*')
              .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
              .order('verified', { ascending: false })
              .order('confidence_score', { ascending: false })
              .limit(15);

            if (fallbackError) {
              console.error('❌ Fallback query also failed:', fallbackError);
              throw fallbackError;
            }

            allResults = fallbackData || [];
          } else {
            allResults = foodItems || [];
          }

          // Also search in daily_meals (meal plan data) if user is authenticated
          if (user?.id) {
            const { data: mealPlanItems, error: mealError } = await supabase
              .from('daily_meals')
              .select(`
                *,
                weekly_meal_plans!inner(
                  user_id,
                  week_start_date
                )
              `)
              .eq('weekly_meal_plans.user_id', user.id)
              .ilike('name', `%${searchTerm}%`)
              .limit(5);

            if (!mealError && mealPlanItems && mealPlanItems.length > 0) {
              // Convert meal plan items to food item format
              const convertedMealPlanItems = mealPlanItems.map(meal => ({
                id: `meal-plan-${meal.id}`,
                name: `${meal.name} (Meal Plan)`,
                brand: 'Your Meal Plan',
                category: 'meal_plan',
                calories_per_100g: meal.calories || 0,
                protein_per_100g: meal.protein || 0,
                carbs_per_100g: meal.carbs || 0,
                fat_per_100g: meal.fat || 0,
                fiber_per_100g: 0,
                sugar_per_100g: 0,
                serving_description: '1 serving',
                verified: true,
                confidence_score: 1.0,
                source: 'meal_plan',
                meal_plan_data: meal
              }));

              // Add meal plan items to results
              allResults = [...allResults, ...convertedMealPlanItems];
            }
          }

          console.log('✅ Combined search successful, found:', allResults.length, 'items');
          return allResults;
        } catch (error) {
          console.error('❌ Search error:', error);
          throw error;
        }
      },
      enabled: !!searchTerm && searchTerm.length >= 2,
      staleTime: 30000,
      retry: 1,
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
      mealPlanData?: any;
    }) => {
      console.log('📝 Logging food consumption:', consumption);

      const consumedAt = new Date().toISOString();
      console.log('📅 Using consumed_at timestamp:', consumedAt);

      let actualFoodItemId = consumption.foodItemId;
      
      // Handle meal plan items - create a proper food item first
      if (consumption.source === 'meal_plan' || consumption.foodItemId.startsWith('meal-plan-') || consumption.foodItemId.startsWith('temp-')) {
        console.log('🍽️ Creating food item for meal plan item');
        
        const mealName = consumption.mealPlanData?.name || consumption.notes?.replace('From meal plan: ', '') || 'Meal Plan Item';
        
        // Create or find existing food item for this meal plan item
        const { data: existingFoodItem, error: findError } = await supabase
          .from('food_items')
          .select('id')
          .eq('name', mealName)
          .eq('category', 'meal_plan')
          .maybeSingle();

        if (!findError && existingFoodItem) {
          actualFoodItemId = existingFoodItem.id;
          console.log('✅ Using existing food item:', actualFoodItemId);
        } else {
          // Create new food item
          const { data: newFoodItem, error: createError } = await supabase
            .from('food_items')
            .insert({
              name: mealName,
              category: 'meal_plan',
              calories_per_100g: consumption.calories,
              protein_per_100g: consumption.protein,
              carbs_per_100g: consumption.carbs,
              fat_per_100g: consumption.fat,
              verified: true,
              source: 'meal_plan',
              brand: 'Meal Plan'
            })
            .select('id')
            .single();

          if (createError) {
            console.error('❌ Error creating food item:', createError);
            throw new Error(`Failed to create food item: ${createError.message}`);
          }
          
          actualFoodItemId = newFoodItem.id;
          console.log('✅ Created new food item:', actualFoodItemId);
        }
      }

      // Log the consumption
      const { data, error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user?.id,
          food_item_id: actualFoodItemId,
          quantity_g: consumption.source === 'meal_plan' ? 100 : consumption.quantity,
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
        throw new Error(`Failed to log consumption: ${error.message}`);
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
                 queryKey.includes('food-consumption-today') ||
                 queryKey.includes('today-meal-plan');
        }
      });
      
      // Force immediate refetch of active queries
      await queryClient.refetchQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('food-consumption-today') || 
                 queryKey.includes('today-meal-plan');
        },
        type: 'active'
      });
      
      console.log('✅ All queries invalidated and refetched');
      toast.success('Food logged successfully!');
    },
    onError: (error) => {
      console.error('❌ Error logging food consumption:', error);
      toast.error(`Failed to log food: ${error.message}`);
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
