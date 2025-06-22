
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWeightTracking = () => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['weight-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching weight entries:', error);
        throw error;
      }

      return data;
    },
  });

  return {
    entries,
    isLoading,
  };
};
