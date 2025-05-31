
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTypingIndicator = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Send typing indicator
  const sendTypingIndicator = () => {
    if (!user?.id || !channelRef.current) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, isTyping: true }
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user.id, isTyping: false }
        });
      }
    }, 3000);
  };

  // Stop typing indicator
  const stopTypingIndicator = () => {
    if (!user?.id || !channelRef.current) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, isTyping: false }
    });
  };

  useEffect(() => {
    if (!coachId || !traineeId || !user?.id) return;

    // Create channel for typing indicators
    const channel = supabase.channel(`typing-${coachId}-${traineeId}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const { userId, isTyping } = payload;
        
        // Don't show own typing indicator
        if (userId === user.id) return;

        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });

        // Auto-remove typing indicator after 5 seconds
        if (isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(userId);
              return newSet;
            });
          }, 5000);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [coachId, traineeId, user?.id]);

  return {
    typingUsers: Array.from(typingUsers),
    sendTypingIndicator,
    stopTypingIndicator
  };
};
