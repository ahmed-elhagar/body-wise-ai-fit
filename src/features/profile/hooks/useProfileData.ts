
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useProfileData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const profileMetrics = useMemo(() => {
    if (!profile) return null;

    let score = 0;
    if (profile.first_name) score += 15;
    if (profile.last_name) score += 15;
    if (profile.age) score += 10;
    if (profile.gender) score += 10;
    if (profile.height) score += 10;
    if (profile.weight) score += 10;
    if (profile.body_fat_percentage) score += 10;
    if (profile.fitness_goal) score += 10;
    if (profile.activity_level) score += 10;

    return {
      completionScore: Math.min(score, 100),
      hasBasicInfo: !!(profile.first_name && profile.last_name && profile.age),
      hasPhysicalInfo: !!(profile.height && profile.weight),
      hasBodyComposition: !!(profile.body_fat_percentage && profile.body_shape),
      hasGoals: !!(profile.fitness_goal && profile.activity_level),
      isProfileComplete: score >= 80
    };
  }, [profile]);

  const completionPercentage = profileMetrics?.completionScore || 0;

  return {
    user,
    profile,
    profileMetrics,
    isLoading,
    completionPercentage,
  };
};
