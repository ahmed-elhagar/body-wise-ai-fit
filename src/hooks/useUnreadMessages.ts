
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUnreadMessages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      console.log('🔔 useUnreadMessages: Fetching unread messages for user:', user.id);

      // Count unread messages where current user is the recipient
      // This works for both coaches and trainees
      const { count, error } = await supabase
        .from('coach_trainee_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .or(`and(coach_id.eq.${user.id},sender_type.eq.trainee),and(trainee_id.eq.${user.id},sender_type.eq.coach)`)
        .neq('sender_id', user.id);

      if (error) {
        console.error('❌ useUnreadMessages: Error fetching unread message count:', error);
        return 0;
      }

      console.log('📊 useUnreadMessages: Unread messages count:', count);
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

// Hook to get unread messages per trainee for coaches
export const useUnreadMessagesByTrainee = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages-by-trainee', user?.id],
    queryFn: async () => {
      if (!user?.id) return {};

      console.log('🔔 useUnreadMessagesByTrainee: Fetching unread messages by trainee for coach:', user.id);

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('trainee_id')
        .eq('coach_id', user.id)
        .eq('is_read', false)
        .eq('sender_type', 'trainee') // Only messages from trainees to coach
        .neq('sender_id', user.id);

      if (error) {
        console.error('❌ useUnreadMessagesByTrainee: Error fetching unread messages by trainee:', error);
        return {};
      }

      // Count unread messages per trainee
      const unreadCounts: Record<string, number> = {};
      data.forEach((msg) => {
        unreadCounts[msg.trainee_id] = (unreadCounts[msg.trainee_id] || 0) + 1;
      });

      console.log('📊 useUnreadMessagesByTrainee: Unread counts by trainee:', unreadCounts);
      return unreadCounts;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000,
  });
};

// Hook to get unread messages from coach for trainees
export const useUnreadMessagesFromCoach = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages-from-coach', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      console.log('🔔 useUnreadMessagesFromCoach: Fetching unread messages from coach for trainee:', user.id);

      const { count, error } = await supabase
        .from('coach_trainee_messages')
        .select('*', { count: 'exact', head: true })
        .eq('trainee_id', user.id)
        .eq('is_read', false)
        .eq('sender_type', 'coach') // Only messages from coach to trainee
        .neq('sender_id', user.id);

      if (error) {
        console.error('❌ useUnreadMessagesFromCoach: Error fetching unread messages from coach:', error);
        return 0;
      }

      console.log('📊 useUnreadMessagesFromCoach: Unread messages from coach:', count);
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
