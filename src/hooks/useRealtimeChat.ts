
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { ChatMessage } from './useCoachChat';

export const useRealtimeChat = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!coachId || !traineeId || !user?.id) return;

    console.log('🔄 Setting up enhanced real-time chat subscription');

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`enhanced-chat-${coachId}-${traineeId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId},trainee_id=eq.${traineeId}`,
        },
        (payload) => {
          console.log('📨 Real-time message received:', payload);
          
          // Invalidate and refetch messages
          queryClient.invalidateQueries({ 
            queryKey: ['coach-chat-messages', coachId, traineeId] 
          });
          
          // Show notification for messages from others
          if (payload.new?.sender_id !== user?.id) {
            toast.info('New message received', {
              duration: 3000,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId},trainee_id=eq.${traineeId}`,
        },
        (payload) => {
          console.log('📝 Message updated:', payload);
          queryClient.invalidateQueries({ 
            queryKey: ['coach-chat-messages', coachId, traineeId] 
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log('🔌 Cleaning up enhanced chat subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [coachId, traineeId, user?.id, queryClient]);

  return {
    isConnected: !!channelRef.current,
  };
};
