
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useLiveNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 Setting up live notifications');

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `trainee_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📨 New message notification for trainee:', payload);
          
          const message = payload.new as any;
          
          // Don't notify for own messages
          if (message.sender_id === user.id) return;
          
          // Show notification
          toast.info('New message from your coach', {
            duration: 4000,
            action: {
              label: 'View',
              onClick: () => {
                // Navigate to chat (you can enhance this)
                window.location.href = '/chat';
              },
            },
          });
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ 
            queryKey: ['coach-chat-messages'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['coach-system'] 
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📨 New message notification for coach:', payload);
          
          const message = payload.new as any;
          
          // Don't notify for own messages
          if (message.sender_id === user.id) return;
          
          // Show notification
          toast.info('New message from trainee', {
            duration: 4000,
            action: {
              label: 'View',
              onClick: () => {
                window.location.href = '/chat';
              },
            },
          });
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ 
            queryKey: ['coach-chat-messages'] 
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🔔 New user notification:', payload);
          
          const notification = payload.new as any;
          
          // Show toast notification
          toast.info(notification.title, {
            description: notification.message,
            duration: 5000,
          });
          
          // Invalidate notifications query
          queryClient.invalidateQueries({ 
            queryKey: ['user-notifications'] 
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log('🔌 Cleaning up live notifications');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, queryClient]);

  return {};
};
