
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserOnlineStatus {
  isOnline: boolean;
  lastSeen: Date | null;
  updateStatus: (online: boolean) => Promise<void>;
  onlineUsers: string[];
}

export const useUserOnlineStatus = (): UserOnlineStatus => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const updateUserPresence = useCallback(async (online: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_online: online,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user presence:', error);
      } else {
        setIsOnline(online);
        setLastSeen(new Date());
      }
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user?.id]);

  const updateStatus = useCallback(async (online: boolean) => {
    await updateUserPresence(online);
  }, [updateUserPresence]);

  // Set user as online when component mounts
  useEffect(() => {
    if (user?.id) {
      updateUserPresence(true);
    }

    // Set user as offline when page is closed/refreshed
    const handleBeforeUnload = () => {
      if (user?.id) {
        // Use sendBeacon for reliable offline status update
        navigator.sendBeacon(
          `${supabase.supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`,
          JSON.stringify({
            is_online: false,
            last_seen: new Date().toISOString()
          })
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateUserPresence(false);
      } else {
        updateUserPresence(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (user?.id) {
        updateUserPresence(false);
      }
    };
  }, [user?.id, updateUserPresence]);

  // Subscribe to real-time presence updates
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel('online_users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'is_online=eq.true'
        },
        (payload) => {
          console.log('Presence update:', payload);
          // Handle real-time presence updates here
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return {
    isOnline,
    lastSeen,
    updateStatus,
    onlineUsers
  };
};
