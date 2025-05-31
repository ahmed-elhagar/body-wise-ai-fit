
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUnreadMessages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      // Count unread messages where current user is the recipient
      const { count, error } = await supabase
        .from('coach_trainee_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .or(`coach_id.eq.${user.id},trainee_id.eq.${user.id}`)
        .neq('sender_id', user.id);

      if (error) {
        console.error('Error fetching unread message count:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Check every 10 seconds
  });
};

// Hook to get unread messages per trainee for coaches
export const useUnreadMessagesByTrainee = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages-by-trainee', user?.id],
    queryFn: async () => {
      if (!user?.id) return {};

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('trainee_id')
        .eq('coach_id', user.id)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      if (error) {
        console.error('Error fetching unread messages by trainee:', error);
        return {};
      }

      // Count unread messages per trainee
      const unreadCounts: Record<string, number> = {};
      data.forEach((msg) => {
        unreadCounts[msg.trainee_id] = (unreadCounts[msg.trainee_id] || 0) + 1;
      });

      return unreadCounts;
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Check every 10 seconds
  });
};
