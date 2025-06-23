
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeChat = (coachId?: string, traineeId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!coachId || !traineeId) {
      setIsConnected(false);
      return;
    }

    let channel: any;

    const setupRealtimeConnection = async () => {
      try {
        // Subscribe to real-time changes in coach_trainee_messages
        channel = supabase
          .channel(`chat:${coachId}:${traineeId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'coach_trainee_messages',
              filter: `coach_id=eq.${coachId},trainee_id=eq.${traineeId}`
            },
            (payload) => {
              console.log('Real-time message update:', payload);
              // Handle real-time message updates
            }
          )
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
            setIsConnected(status === 'SUBSCRIBED');
            if (status === 'CHANNEL_ERROR') {
              setConnectionError('Failed to connect to real-time chat');
            } else {
              setConnectionError(null);
            }
          });

      } catch (error) {
        console.error('Error setting up realtime connection:', error);
        setConnectionError('Connection failed');
        setIsConnected(false);
      }
    };

    setupRealtimeConnection();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [coachId, traineeId]);

  return {
    isConnected,
    connectionError
  };
};
