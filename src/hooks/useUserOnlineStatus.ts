
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnlineStatusData {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const useUserOnlineStatus = (userIds: string[]) => {
  const [onlineStatus, setOnlineStatus] = useState<Record<string, OnlineStatusData>>({});
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userIds.length) return;

    // Fetch initial online status
    const fetchOnlineStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, is_online, last_seen')
          .in('id', userIds);

        if (error) throw error;

        const statusMap: Record<string, OnlineStatusData> = {};
        data?.forEach(profile => {
          statusMap[profile.id] = {
            userId: profile.id,
            isOnline: profile.is_online || false,
            lastSeen: profile.last_seen
          };
        });

        setOnlineStatus(statusMap);
      } catch (error) {
        console.error('Error fetching online status:', error);
      }
    };

    fetchOnlineStatus();

    // Set up real-time subscription for online status changes
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('user-online-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${userIds.join(',')})`,
        },
        (payload) => {
          console.log('👤 User status update:', payload);
          
          const profile = payload.new as any;
          
          setOnlineStatus(prev => ({
            ...prev,
            [profile.id]: {
              userId: profile.id,
              isOnline: profile.is_online || false,
              lastSeen: profile.last_seen
            }
          }));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userIds]);

  const isUserOnline = (userId: string): boolean => {
    return onlineStatus[userId]?.isOnline || false;
  };

  const getUserLastSeen = (userId: string): string | undefined => {
    return onlineStatus[userId]?.lastSeen;
  };

  const getOnlineCount = (): number => {
    return Object.values(onlineStatus).filter(status => status.isOnline).length;
  };

  return {
    onlineStatus,
    isUserOnline,
    getUserLastSeen,
    getOnlineCount
  };
};
