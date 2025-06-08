
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useMealPlans = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!user?.id) {
        setMealPlans([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('weekly_meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMealPlans(data || []);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        setMealPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealPlans();
  }, [user?.id]);

  return { mealPlans, isLoading };
};
