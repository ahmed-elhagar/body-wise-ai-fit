
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserOnlineStatus {
  isOnline: boolean;
  lastSeen: Date | null;
  updateStatus: (online: boolean) => Promise<void>;
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
  getUserLastSeen: (userId: string) => Date | null;
}

export const useUserOnlineStatus = (userIds: string[] = []): UserOnlineStatus => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userStatuses, setUserStatuses] = useState<Record<string, { isOnline: boolean; lastSeen: Date | null }>>({});

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

  const isUserOnline = useCallback((userId: string) => {
    return userStatuses[userId]?.isOnline || false;
  }, [userStatuses]);

  const getUserLastSeen = useCallback((userId: string) => {
    return userStatuses[userId]?.lastSeen || null;
  }, [userStatuses]);

  // Set user as online when component mounts
  useEffect(() => {
    if (user?.id) {
      updateUserPresence(true);
    }

    // Set user as offline when page is closed/refreshed
    const handleBeforeUnload = () => {
      if (user?.id) {
        // Use fetch for reliable offline status update instead of navigator.sendBeacon
        fetch('/api/user-offline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
          keepalive: true
        }).catch(() => {
          // Silently fail - user is leaving anyway
        });
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

  // Fetch status for specific users
  useEffect(() => {
    if (userIds.length === 0) return;

    const fetchUserStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, is_online, last_seen')
          .in('id', userIds);

        if (error) throw error;

        const statusMap: Record<string, { isOnline: boolean; lastSeen: Date | null }> = {};
        data?.forEach(profile => {
          statusMap[profile.id] = {
            isOnline: profile.is_online || false,
            lastSeen: profile.last_seen ? new Date(profile.last_seen) : null
          };
        });

        setUserStatuses(statusMap);
      } catch (error) {
        console.error('Error fetching user statuses:', error);
      }
    };

    fetchUserStatuses();
  }, [userIds]);

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
    onlineUsers,
    isUserOnline,
    getUserLastSeen
  };
};
