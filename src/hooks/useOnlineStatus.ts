
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!user?.id) return;

    console.log('🟢 Setting up online status tracking for user:', user.id);

    // Set user as online when hook initializes
    const setOnline = async () => {
      try {
        await supabase.rpc('update_user_online_status', {
          user_id: user.id,
          is_online: true
        });
        console.log('✅ User status set to online');
      } catch (error) {
        console.error('❌ Error setting online status:', error);
      }
    };

    // Set user as offline
    const setOffline = async () => {
      try {
        await supabase.rpc('update_user_online_status', {
          user_id: user.id,
          is_online: false
        });
        console.log('🔴 User status set to offline');
      } catch (error) {
        console.error('❌ Error setting offline status:', error);
      }
    };

    // Track user activity with throttling
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current > 5000) { // Throttle to every 5 seconds
        isActiveRef.current = true;
        lastActivityRef.current = now;
        console.log('👆 User activity detected');
      }
    };

    const handleInactivity = () => {
      isActiveRef.current = false;
      console.log('😴 User inactive');
    };

    // Set initial online status
    setOnline();

    // Enhanced heartbeat with activity check
    heartbeatRef.current = setInterval(async () => {
      if (isActiveRef.current) {
        await setOnline();
        console.log('💓 Heartbeat: User active, status updated');
      } else {
        console.log('💤 Heartbeat: User inactive, skipping update');
      }
      
      // Reset activity flag after checking
      isActiveRef.current = false;
    }, 30000); // Update every 30 seconds

    // Listen for activity events with passive listeners for better performance
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Enhanced visibility change handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 Tab hidden - setting inactive');
        handleInactivity();
        setOffline();
      } else {
        console.log('📱 Tab visible - setting active');
        handleActivity();
        setOnline();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Enhanced beforeunload with immediate offline status
    const handleBeforeUnload = () => {
      console.log('👋 Page unloading - setting offline');
      // Use sendBeacon for more reliable offline status
      navigator.sendBeacon?.('/api/offline', JSON.stringify({ userId: user.id })) || setOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log('🧹 Cleaning up online status tracking');
      
      // Cleanup
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Set offline when component unmounts
      setOffline();
    };
  }, [user?.id]);

  return {
    isTracking: !!user?.id
  };
};
