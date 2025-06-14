
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeChat = (coachId: string, traineeId: string) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!coachId || !traineeId) return;

    const channel = supabase
      .channel(`chat_${coachId}_${traineeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId} AND trainee_id=eq.${traineeId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          // The useQuery will automatically refetch due to the subscription
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      channel.unsubscribe();
    };
  }, [coachId, traineeId]);

  return { isConnected };
};
