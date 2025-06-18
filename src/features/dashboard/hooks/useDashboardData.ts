
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { DashboardStats } from '../types';

export const useDashboardData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Fetch latest weight
      const { data: weightData } = await supabase
        .from('weight_entries')
        .select('weight')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1);

      // Fetch profile for target weight
      const { data: profileData } = await supabase
        .from('profiles')
        .select('weight')
        .eq('id', user.id)
        .single();

      // Calculate calories consumed today
      const today = new Date().toISOString().split('T')[0];
      const { data: caloriesData } = await supabase
        .from('food_consumption_log')
        .select('calories_consumed')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`);

      const caloriesConsumed = caloriesData?.reduce((sum, entry) => sum + entry.calories_consumed, 0) || 0;

      return {
        currentWeight: weightData?.[0]?.weight,
        targetWeight: profileData?.weight,
        caloriesConsumed,
        caloriesTarget: 2000, // This should come from user's profile
        workoutsCompleted: 0, // TODO: Calculate from exercise logs
        workoutsTarget: 4,
        streak: 0 // TODO: Calculate streak
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
