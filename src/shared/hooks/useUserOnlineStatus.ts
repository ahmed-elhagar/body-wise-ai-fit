import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useUserOnlineStatus = (userIds?: string[]) => {
  const { user } = useAuth();
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>({});
  const [userLastSeen, setUserLastSeen] = useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Track browser online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Update user's online status in the database
    const updateOnlineStatus = async (online: boolean) => {
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: user.id,
            is_online: online,
            last_seen: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    // Set user as online when component mounts
    updateOnlineStatus(true);

    // Set user as offline when page unloads
    const handleBeforeUnload = () => updateOnlineStatus(false);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Subscribe to other users' presence changes
    const channel = supabase
      .channel('user_presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence'
      }, (payload) => {
        if (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new) {
          const { user_id, is_online, last_seen } = payload.new as { 
            user_id: string; 
            is_online: boolean;
            last_seen?: string;
          };
          setUserStatuses(prev => ({
            ...prev,
            [user_id]: is_online
          }));
          if (last_seen) {
            setUserLastSeen(prev => ({
              ...prev,
              [user_id]: last_seen
            }));
          }
        }
      })
      .subscribe();

    return () => {
      updateOnlineStatus(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Load initial presence data for specific users
  useEffect(() => {
    if (!userIds || userIds.length === 0) return;

    const loadUserPresence = async () => {
      try {
        const { data } = await supabase
          .from('user_presence')
          .select('user_id, is_online, last_seen')
          .in('user_id', userIds);

        if (data) {
          const statuses: Record<string, boolean> = {};
          const lastSeenData: Record<string, string> = {};
          
          data.forEach(({ user_id, is_online, last_seen }) => {
            statuses[user_id] = is_online;
            if (last_seen) lastSeenData[user_id] = last_seen;
          });
          
          setUserStatuses(prev => ({ ...prev, ...statuses }));
          setUserLastSeen(prev => ({ ...prev, ...lastSeenData }));
        }
      } catch (error) {
        console.error('Error loading user presence:', error);
      }
    };

    loadUserPresence();
  }, [userIds]);

  const getUserOnlineStatus = (userId: string): boolean => {
    return userStatuses[userId] ?? false;
  };

  // Alias for backward compatibility
  const isUserOnline = (userId: string): boolean => {
    return getUserOnlineStatus(userId);
  };

  const getUserLastSeen = (userId: string): string | undefined => {
    return userLastSeen[userId];
  };

  const setUserStatus = (userId: string, online: boolean) => {
    setUserStatuses(prev => ({
      ...prev,
      [userId]: online
    }));
  };

  return {
    isOnline,
    userStatuses,
    getUserOnlineStatus,
    isUserOnline, // Added for backward compatibility
    getUserLastSeen, // Added missing function
    setUserStatus
  };
};
