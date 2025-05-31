
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useLiveNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    try {
      // Create a subtle notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const createNotificationSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      };
      
      notificationSoundRef.current = { play: createNotificationSound } as any;
    } catch (error) {
      console.log('🔇 Audio context not available, notifications will be silent');
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 Setting up enhanced live notifications for user:', user.id);

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`notifications-${user.id}-${Date.now()}`)
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
          
          // Play notification sound
          try {
            notificationSoundRef.current?.play();
          } catch (error) {
            console.log('🔇 Could not play notification sound');
          }
          
          // Show enhanced notification
          toast.success('New message from your coach', {
            description: message.message?.substring(0, 50) + (message.message?.length > 50 ? '...' : ''),
            duration: 5000,
            action: {
              label: 'View Chat',
              onClick: () => {
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
          
          // Play notification sound
          try {
            notificationSoundRef.current?.play();
          } catch (error) {
            console.log('🔇 Could not play notification sound');
          }
          
          // Show enhanced notification
          toast.success('New message from trainee', {
            description: message.message?.substring(0, 50) + (message.message?.length > 50 ? '...' : ''),
            duration: 5000,
            action: {
              label: 'View Chat',
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
          
          // Show toast notification based on type
          const toastConfig = {
            duration: 6000,
            action: notification.action_url ? {
              label: 'View',
              onClick: () => {
                window.open(notification.action_url, '_blank');
              },
            } : undefined,
          };

          switch (notification.type) {
            case 'success':
              toast.success(notification.title, {
                description: notification.message,
                ...toastConfig,
              });
              break;
            case 'warning':
              toast.warning(notification.title, {
                description: notification.message,
                ...toastConfig,
              });
              break;
            case 'error':
              toast.error(notification.title, {
                description: notification.message,
                ...toastConfig,
              });
              break;
            default:
              toast.info(notification.title, {
                description: notification.message,
                ...toastConfig,
              });
          }
          
          // Invalidate notifications query
          queryClient.invalidateQueries({ 
            queryKey: ['user-notifications'] 
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Live notifications subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to live notifications');
          setIsConnected(true);
          
          // Show welcome toast only once when first connected
          if (!hasShownWelcomeToast) {
            setTimeout(() => {
              toast.success('Real-time notifications enabled', {
                description: 'You\'ll receive live updates for new messages and notifications.',
                duration: 3000,
              });
              setHasShownWelcomeToast(true);
            }, 1000);
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error for live notifications');
          setIsConnected(false);
          
          // Show connection error toast
          toast.error('Connection Error', {
            description: 'Live notifications may not work properly. Please refresh the page.',
            duration: 8000,
            action: {
              label: 'Refresh',
              onClick: () => window.location.reload(),
            },
          });
        } else {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🔌 Cleaning up live notifications');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [user?.id, queryClient, hasShownWelcomeToast]);

  return {
    isConnected,
    hasNotificationSupport: !!notificationSoundRef.current
  };
};
