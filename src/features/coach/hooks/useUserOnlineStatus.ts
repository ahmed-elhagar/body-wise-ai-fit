
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserOnlineStatus = (userIds: string[]) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [lastSeenData, setLastSeenData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userIds.length === 0) return;

    // Fetch initial online status and last seen data from profiles table
    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, last_seen, is_online')
          .in('id', userIds);

        if (error) {
          console.error('Error fetching user presence:', error);
          return;
        }

        const online = new Set<string>();
        const lastSeen: Record<string, string> = {};

        data.forEach(profile => {
          if (profile.is_online) {
            online.add(profile.id);
          }
          if (profile.last_seen) {
            lastSeen[profile.id] = profile.last_seen;
          }
        });

        setOnlineUsers(online);
        setLastSeenData(lastSeen);
      } catch (error) {
        console.error('Error in fetchUserStatus:', error);
      }
    };

    fetchUserStatus();

    // Set up real-time subscription for presence updates
    const subscription = supabase
      .channel('user_presence_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${userIds.join(',')})`
        },
        (payload) => {
          const { id, is_online, last_seen } = payload.new as any;
          
          setOnlineUsers(prev => {
            const updated = new Set(prev);
            if (is_online) {
              updated.add(id);
            } else {
              updated.delete(id);
            }
            return updated;
          });

          setLastSeenData(prev => ({
            ...prev,
            [id]: last_seen
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userIds.join(',')]);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);
  const getUserLastSeen = (userId: string) => lastSeenData[userId];

  return {
    isUserOnline,
    getUserLastSeen,
    onlineUsers: Array.from(onlineUsers)
  };
};
