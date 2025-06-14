
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnlineStatusData {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const useUserOnlineStatus = (userIds: string[]) => {
  const [onlineStatus, setOnlineStatus] = useState<Record<string, OnlineStatusData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Memoize user IDs to prevent unnecessary re-renders
  const stableUserIds = JSON.stringify(userIds.sort());

  const fetchOnlineStatus = useCallback(async () => {
    if (!userIds.length) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('👥 Fetching online status for users:', userIds);
      setError(null);
      
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
      setIsLoading(false);
      retryCountRef.current = 0;
      console.log('✅ Online status fetched successfully:', statusMap);
    } catch (error) {
      console.error('❌ Error fetching online status:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch online status');
      setIsLoading(false);
      
      // Retry with exponential backoff
      if (retryCountRef.current < 3) {
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        retryTimeoutRef.current = setTimeout(() => {
          retryCountRef.current++;
          fetchOnlineStatus();
        }, delay);
      }
    }
  }, [stableUserIds]);

  useEffect(() => {
    const parsedUserIds = JSON.parse(stableUserIds);
    if (!parsedUserIds.length) {
      setIsLoading(false);
      return;
    }

    fetchOnlineStatus();

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up real-time subscription with enhanced error handling
    const channel = supabase
      .channel(`user-online-status-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${parsedUserIds.join(',')})`,
        },
        (payload) => {
          console.log('👤 Real-time user status update:', payload);
          
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
      .subscribe((status) => {
        console.log('📡 Online status subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to online status updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error for online status subscription');
          setError('Real-time connection failed');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🧹 Cleaning up online status subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [stableUserIds, fetchOnlineStatus]);

  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineStatus[userId]?.isOnline || false;
  }, [onlineStatus]);

  const getUserLastSeen = useCallback((userId: string): string | undefined => {
    return onlineStatus[userId]?.lastSeen;
  }, [onlineStatus]);

  const getOnlineCount = useCallback((): number => {
    return Object.values(onlineStatus).filter(status => status.isOnline).length;
  }, [onlineStatus]);

  const refreshStatus = useCallback(() => {
    setIsLoading(true);
    fetchOnlineStatus();
  }, [fetchOnlineStatus]);

  return {
    onlineStatus,
    isUserOnline,
    getUserLastSeen,
    getOnlineCount,
    isLoading,
    error,
    refreshStatus
  };
};
