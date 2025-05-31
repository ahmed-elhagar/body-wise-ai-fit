
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!user?.id) return;

    // Set user as online when hook initializes
    const setOnline = async () => {
      try {
        await supabase.rpc('update_user_online_status', {
          user_id: user.id,
          is_online: true
        });
      } catch (error) {
        console.error('Error setting online status:', error);
      }
    };

    // Set user as offline
    const setOffline = async () => {
      try {
        await supabase.rpc('update_user_online_status', {
          user_id: user.id,
          is_online: false
        });
      } catch (error) {
        console.error('Error setting offline status:', error);
      }
    };

    // Track user activity
    const handleActivity = () => {
      isActiveRef.current = true;
    };

    const handleInactivity = () => {
      isActiveRef.current = false;
    };

    // Set initial online status
    setOnline();

    // Heartbeat to maintain online status
    heartbeatRef.current = setInterval(async () => {
      if (isActiveRef.current) {
        await setOnline();
      }
    }, 30000); // Update every 30 seconds

    // Listen for activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleInactivity();
      } else {
        handleActivity();
      }
    });

    // Set offline when page unloads
    const handleBeforeUnload = () => {
      setOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      document.removeEventListener('visibilitychange', handleActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Set offline when component unmounts
      setOffline();
    };
  }, [user?.id]);

  return {};
};
