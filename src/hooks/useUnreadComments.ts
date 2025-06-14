
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUnreadComments = () => {
  const { user } = useAuth();

  const { data: hasUnreadComments = false } = useQuery({
    queryKey: ['unread-comments', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      // Check for comments in the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data, error } = await supabase
        .from('meal_comments')
        .select('id')
        .eq('trainee_id', user.id)
        .neq('coach_id', user.id) // Comments from coach, not from trainee
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .limit(1);

      if (error) {
        console.error('Error checking unread comments:', error);
        return false;
      }

      return data && data.length > 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Check every 30 seconds
  });

  return { hasUnreadComments };
};
