
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (coachId: string, traineeId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Send typing indicator
  const sendTypingIndicator = useCallback(() => {
    if (!coachId || !traineeId) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing event
    supabase
      .channel(`typing_${coachId}_${traineeId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: coachId, isTyping: true }
      });

    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      stopTypingIndicator();
    }, 3000);

    setTypingTimeout(timeout);
  }, [coachId, traineeId, typingTimeout]);

  // Stop typing indicator
  const stopTypingIndicator = useCallback(() => {
    if (!coachId || !traineeId) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    supabase
      .channel(`typing_${coachId}_${traineeId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: coachId, isTyping: false }
      });
  }, [coachId, traineeId, typingTimeout]);

  // Listen for typing indicators
  useEffect(() => {
    if (!coachId || !traineeId) return;

    const channel = supabase
      .channel(`typing_${coachId}_${traineeId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, isTyping } = payload.payload;
        
        setTypingUsers(prev => {
          if (isTyping) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [coachId, traineeId]);

  return {
    typingUsers,
    sendTypingIndicator,
    stopTypingIndicator
  };
};
