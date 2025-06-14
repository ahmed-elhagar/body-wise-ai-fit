
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUnreadMessages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return { total: 0, byTrainee: {} };

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('trainee_id, coach_id')
        .eq('is_read', false)
        .or(`coach_id.eq.${user.id},trainee_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching unread messages:', error);
        return { total: 0, byTrainee: {} };
      }

      const byTrainee: Record<string, number> = {};
      data.forEach(msg => {
        const key = user.id === msg.coach_id ? msg.trainee_id : msg.coach_id;
        byTrainee[key] = (byTrainee[key] || 0) + 1;
      });

      return {
        total: data.length,
        byTrainee
      };
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

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
        .eq('sender_type', 'trainee');

      if (error) {
        console.error('Error fetching unread messages by trainee:', error);
        return {};
      }

      const unreadCounts: Record<string, number> = {};
      data.forEach(msg => {
        unreadCounts[msg.trainee_id] = (unreadCounts[msg.trainee_id] || 0) + 1;
      });

      return unreadCounts;
    },
    enabled: !!user?.id,
    refetchInterval: 5000,
  });
};
