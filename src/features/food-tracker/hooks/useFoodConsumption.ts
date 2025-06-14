
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth'; // This global hook is fine
import { toast } from 'sonner';
import { format, startOfDay, endOfDay, startOfWeek } from 'date-fns';

export interface FoodConsumptionLog {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  meal_type: string;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  consumed_at: string;
  meal_image_url?: string;
  notes?: string;
  source: string;
  ai_analysis_data?: any;
  food_item?: {
    id: string;
    name: string;
    brand?: string;
    category: string;
    serving_description?: string;
  };
}

export interface MealPlanItem {
  id: string;
  name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  day_number: number;
  source: 'meal_plan';
  ingredients?: any[];
  instructions?: any[];
}

export const useFoodConsumption = (date?: Date) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const targetDate = date || new Date();

  // Get today's consumption with enhanced reliability
  const { data: todayConsumption, isLoading, refetch } = useQuery({
    queryKey: ['food-consumption-today', user?.id, format(targetDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ No user ID for food consumption query');
        return [];
      }

      const dayStart = startOfDay(targetDate);
      const dayEnd = endOfDay(targetDate);

      console.log('🔍 Fetching food consumption for:', {
        userId: user.id.substring(0, 8) + '...',
        targetDate: format(targetDate, 'yyyy-MM-dd'),
        dayStart: dayStart.toISOString(),
        dayEnd: dayEnd.toISOString()
      });

      try {
        const { data, error } = await supabase
          .from('food_consumption_log')
          .select(`
            *,
            food_item:food_items(
              id,
              name,
              brand,
              category,
              serving_description
            )
          `)
          .eq('user_id', user.id)
          .gte('consumed_at', dayStart.toISOString())
          .lte('consumed_at', dayEnd.toISOString())
          .order('consumed_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching food consumption:', error);
          throw error;
        }

        console.log('✅ Food consumption data fetched:', {
          count: data?.length || 0,
          hasData: !!data,
          firstItemDetails: data?.[0] ? {
            id: data[0].id,
            foodName: data[0].food_item?.name,
            consumedAt: data[0].consumed_at,
            hasFoodItem: !!data[0].food_item
          } : null
        });

        return data as FoodConsumptionLog[];
      } catch (error) {
        console.error('❌ Food consumption query failed:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 10000,
    gcTime: 300000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Get today's meal plan data
  const { data: todayMealPlan, isLoading: isMealPlanLoading } = useQuery({
    queryKey: ['today-meal-plan', user?.id, format(targetDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user?.id) return [];

      // Calculate current week start (Saturday)
      const currentWeekStart = startOfWeek(targetDate, { weekStartsOn: 6 });
      const weekStartDateStr = format(currentWeekStart, 'yyyy-MM-dd');
      
      // Calculate day number (Saturday = 1, Sunday = 2, etc.)
      const dayOfWeek = targetDate.getDay();
      const dayNumber = dayOfWeek === 6 ? 1 : dayOfWeek + 2;

      console.log('🍽️ Fetching meal plan for:', {
        weekStartDate: weekStartDateStr,
        dayNumber,
        targetDate: format(targetDate, 'yyyy-MM-dd')
      });

      try {
        // First get the weekly plan
        const { data: weeklyPlan, error: weeklyError } = await supabase
          .from('weekly_meal_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDateStr)
          .maybeSingle();

        if (weeklyError) {
          console.error('❌ Error fetching weekly plan:', weeklyError);
          return [];
        }

        if (!weeklyPlan) {
          console.log('ℹ️ No meal plan found for this week');
          return [];
        }

        // Get today's meals from the plan
        const { data: dailyMeals, error: mealsError } = await supabase
          .from('daily_meals')
          .select('*')
          .eq('weekly_plan_id', weeklyPlan.id)
          .eq('day_number', dayNumber);

        if (mealsError) {
          console.error('❌ Error fetching daily meals:', mealsError);
          return [];
        }

        console.log('✅ Meal plan data fetched:', {
          mealsCount: dailyMeals?.length || 0,
          weeklyPlanId: weeklyPlan.id
        });

        return (dailyMeals || []).map(meal => ({
          ...meal,
          source: 'meal_plan'
        })) as MealPlanItem[];
      } catch (error) {
        console.error('❌ Meal plan query failed:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnMount: true,
  });

  // Get consumption history for a date range
  const getConsumptionHistory = (startDate: Date, endDate: Date) => {
    return useQuery({
      queryKey: ['food-consumption-history', user?.id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
      queryFn: async () => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from('food_consumption_log')
          .select(`
            *,
            food_item:food_items(
              id,
              name,
              brand,
              category,
              serving_description
            )
          `)
          .eq('user_id', user.id)
          .gte('consumed_at', startDate.toISOString())
          .lte('consumed_at', endDate.toISOString())
          .order('consumed_at', { ascending: false });

        if (error) {
          console.error('Error fetching food consumption history:', error);
          throw error;
        }

        return data as FoodConsumptionLog[];
      },
      enabled: !!user?.id,
    });
  };

  // Get historical data for calendar/heatmap
  const useHistoryData = (startDate: Date, endDate: Date) => {
    return useQuery({
      queryKey: ['food-consumption-history', user?.id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
      queryFn: async () => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from('food_consumption_log')
          .select(`
            *,
            food_item:food_items(
              id,
              name,
              brand,
              category,
              serving_description
            )
          `)
          .eq('user_id', user.id)
          .gte('consumed_at', startDate.toISOString())
          .lte('consumed_at', endDate.toISOString())
          .order('consumed_at', { ascending: false });

        if (error) {
          console.error('Error fetching food consumption history:', error);
          throw error;
        }

        return data as FoodConsumptionLog[];
      },
      enabled: !!user?.id,
    });
  };

  // Delete food log entry
  const deleteConsumptionMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('food_consumption_log')
        .delete()
        .eq('id', logId);

      if (error) {
        console.error('Error deleting food log:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption'] });
      toast.success('Food log entry deleted');
    },
    onError: (error) => {
      console.error('Error deleting food log:', error);
      toast.error('Failed to delete food log entry');
    },
  });

  // Enhanced force refresh function
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing food consumption and meal plan data...');
    
    try {
      // Clear specific queries with broader pattern matching
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('food-consumption') || queryKey.includes('today-meal-plan');
        }
      });
      
      // Force refetch the current query
      const result = await refetch();
      
      console.log('✅ Force refresh completed:', {
        success: !!result.data,
        dataCount: result.data?.length || 0
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error during force refresh:', error);
      throw error;
    }
  };

  return {
    todayConsumption,
    todayMealPlan,
    isLoading: isLoading || isMealPlanLoading,
    refetch,
    forceRefresh,
    getConsumptionHistory,
    useHistoryData,
    deleteConsumption: deleteConsumptionMutation.mutate,
    isDeletingConsumption: deleteConsumptionMutation.isPending,
  };
};
