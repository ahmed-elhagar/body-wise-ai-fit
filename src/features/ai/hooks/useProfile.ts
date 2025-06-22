
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfile = () => {
  const { user, loading } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    profile: profile || null,
    isLoading: loading || profileLoading,
    hasProfile: !!profile,
    isProfileComplete: profile ? (profile.profile_completion_score || 0) >= 80 : false,
  };
};
