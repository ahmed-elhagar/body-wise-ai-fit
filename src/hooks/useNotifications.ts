
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement' | 'reminder';
  is_read: boolean;
  action_url?: string;
  created_at: string;
  metadata?: any;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('🔔 Fetching notifications for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('❌ Error fetching notifications:', error);
          throw error;
        }
        
        console.log('✅ Fetched notifications:', data?.length || 0);
        return data as Notification[];
      } catch (error) {
        console.error('❌ Notification fetch failed:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
    staleTime: 5000,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error?.message?.includes('JWT')) return false;
      return failureCount < 3;
    },
  });

  // Set up real-time subscription for notifications with better error handling
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔄 Setting up notifications subscription');

    try {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            try {
              console.log('📨 New notification received:', payload);
              queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
              
              // Show toast for new notification with null checks
              if (payload?.new?.title) {
                toast.info(payload.new.title);
              }
            } catch (error) {
              console.error('❌ Error processing notification payload:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Live notifications subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to live notifications');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Channel error for live notifications');
          }
        });

      return () => {
        console.log('🔌 Cleaning up notifications subscription');
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('❌ Error cleaning up channel:', error);
        }
      };
    } catch (error) {
      console.error('❌ Error setting up notifications subscription:', error);
    }
  }, [user?.id, queryClient]);

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id || !notificationId) return;
      
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error) => {
      console.error('❌ Error marking notification as read:', error);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      console.error('❌ Error marking all notifications as read:', error);
    },
  });

  const createNotification = useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'is_read'>) => {
      if (!user?.id) return;
      
      console.log('📝 Creating notification:', notification);
      
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: user.id,
          ...notification,
        });

      if (error) {
        console.error('❌ Error creating notification:', error);
        throw error;
      }
      
      console.log('✅ Notification created successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error) => {
      console.error('❌ Error in createNotification:', error);
    },
  });

  const unreadCount = notifications?.filter(n => !n?.is_read).length || 0;

  return {
    notifications: notifications || [],
    isLoading,
    unreadCount,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    createNotification: createNotification.mutate,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
  };
};
