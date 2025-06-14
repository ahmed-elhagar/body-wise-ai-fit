
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

  // Initialize notification sound with error handling
  useEffect(() => {
    try {
      // Create a subtle notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const createNotificationSound = () => {
        try {
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
        } catch (soundError) {
          console.log('🔇 Error playing notification sound:', soundError);
        }
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
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('❌ Error removing existing channel:', error);
      }
    }

    try {
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
            try {
              console.log('📨 New message notification for trainee:', payload);
              
              const message = payload.new as any;
              
              // Safety checks
              if (!message || message.sender_id === user.id) return;
              
              // Play notification sound
              try {
                notificationSoundRef.current?.play();
              } catch (error) {
                console.log('🔇 Could not play notification sound');
              }
              
              // Show enhanced notification with null checks
              const messagePreview = message.message?.substring(0, 50) || 'New message';
              const fullPreview = message.message?.length > 50 ? messagePreview + '...' : messagePreview;
              
              toast.success('New message from your coach', {
                description: fullPreview,
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
            } catch (error) {
              console.error('❌ Error processing message notification:', error);
            }
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
            try {
              console.log('📨 New message notification for coach:', payload);
              
              const message = payload.new as any;
              
              // Safety checks
              if (!message || message.sender_id === user.id) return;
              
              // Play notification sound
              try {
                notificationSoundRef.current?.play();
              } catch (error) {
                console.log('🔇 Could not play notification sound');
              }
              
              // Show enhanced notification with null checks
              const messagePreview = message.message?.substring(0, 50) || 'New message';
              const fullPreview = message.message?.length > 50 ? messagePreview + '...' : messagePreview;
              
              toast.success('New message from trainee', {
                description: fullPreview,
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
            } catch (error) {
              console.error('❌ Error processing coach message notification:', error);
            }
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
            try {
              console.log('🔔 New user notification:', payload);
              
              const notification = payload.new as any;
              
              // Safety check
              if (!notification) return;
              
              // Show toast notification based on type with null checks
              const title = notification.title || 'New notification';
              const message = notification.message || '';
              
              const toastConfig = {
                duration: 6000,
                action: notification.action_url ? {
                  label: 'View',
                  onClick: () => {
                    try {
                      window.open(notification.action_url, '_blank');
                    } catch (error) {
                      console.error('❌ Error opening action URL:', error);
                    }
                  },
                } : undefined,
              };

              switch (notification.type) {
                case 'success':
                  toast.success(title, {
                    description: message,
                    ...toastConfig,
                  });
                  break;
                case 'warning':
                  toast.warning(title, {
                    description: message,
                    ...toastConfig,
                  });
                  break;
                case 'error':
                  toast.error(title, {
                    description: message,
                    ...toastConfig,
                  });
                  break;
                default:
                  toast.info(title, {
                    description: message,
                    ...toastConfig,
                  });
              }
              
              // Invalidate notifications query
              queryClient.invalidateQueries({ 
                queryKey: ['user-notifications'] 
              });
            } catch (error) {
              console.error('❌ Error processing user notification:', error);
            }
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
    } catch (error) {
      console.error('❌ Error setting up live notifications:', error);
      setIsConnected(false);
    }

    return () => {
      console.log('🔌 Cleaning up live notifications');
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        } catch (error) {
          console.error('❌ Error cleaning up channel:', error);
        }
      }
      setIsConnected(false);
    };
  }, [user?.id, queryClient, hasShownWelcomeToast]);

  return {
    isConnected,
    hasNotificationSupport: !!notificationSoundRef.current
  };
};
