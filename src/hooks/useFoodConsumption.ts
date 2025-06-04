
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

  // Get today's consumption with improved query
  const { data: todayConsumption, isLoading, refetch } = useQuery({
    queryKey: ['food-consumption-today', user?.id, format(targetDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ No user ID for food consumption query');
        return [];
      }

      // Use more lenient date range to account for timezone issues
      const dayStart = startOfDay(targetDate);
      const dayEnd = endOfDay(targetDate);
      
      // Also check for today's date in user's timezone
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      console.log('🔍 Fetching food consumption for:', {
        userId: user.id.substring(0, 8) + '...',
        targetDate: format(targetDate, 'yyyy-MM-dd'),
        dayStart: dayStart.toISOString(),
        dayEnd: dayEnd.toISOString(),
        todayStart: todayStart.toISOString(),
        todayEnd: todayEnd.toISOString()
      });

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
        .or(`and(consumed_at.gte.${dayStart.toISOString()},consumed_at.lte.${dayEnd.toISOString()}),and(consumed_at.gte.${todayStart.toISOString()},consumed_at.lte.${todayEnd.toISOString()})`)
        .order('consumed_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching food consumption:', error);
        throw error;
      }

      console.log('✅ Food consumption data fetched:', {
        count: data?.length || 0,
        data: data?.slice(0, 3) // Log first 3 entries for debugging
      });

      return data as FoodConsumptionLog[];
    },
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refetch every 5 seconds to ensure data consistency
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

  // Force refresh function for external calls
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing food consumption data...');
    await queryClient.invalidateQueries({ queryKey: ['food-consumption'] });
    await refetch();
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
