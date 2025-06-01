
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import FoodLogTimeline from './components/FoodLogTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import type { FoodConsumptionLog } from '@/types/food';

const TodayTab = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  const { data: foodLogs = [], isLoading, error } = useQuery({
    queryKey: ['food-logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('food_consumption_log')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', today.toISOString())
        .lt('consumed_at', tomorrow.toISOString())
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data as FoodConsumptionLog[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          {t('foodTracker.loadingToday')}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">{t('foodTracker.errorLoading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (foodLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('foodTracker.todaysLog')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            {t('foodTracker.noFoodLogged')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('foodTracker.todaysLog')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FoodLogTimeline 
            foodLogs={foodLogs}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TodayTab;
