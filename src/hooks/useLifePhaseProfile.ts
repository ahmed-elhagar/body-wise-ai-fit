
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useLifePhaseProfile = () => {
  const { user } = useAuth();

  const { data: lifePhaseProfile, isLoading, error } = useQuery({
    queryKey: ['life-phase-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_life_phases')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    lifePhaseProfile,
    isLoading,
    error
  };
};
