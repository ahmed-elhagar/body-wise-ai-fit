
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { format, startOfDay, endOfDay } from 'date-fns';

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
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
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
    console.log('🔄 Force refreshing food consumption data...');
    
    try {
      // Clear specific queries with broader pattern matching
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('food-consumption');
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
    isLoading,
    refetch,
    forceRefresh,
    getConsumptionHistory,
    useHistoryData,
    deleteConsumption: deleteConsumptionMutation.mutate,
    isDeletingConsumption: deleteConsumptionMutation.isPending,
  };
};
