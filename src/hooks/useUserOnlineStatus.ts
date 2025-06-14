
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserOnlineStatus = (userIds: string | string[]) => {
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({});
  const [lastSeenDates, setLastSeenDates] = useState<Record<string, string>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ids = Array.isArray(userIds) ? userIds : [userIds];
    if (ids.length === 0) return;

    // Simple implementation - in a real app, this would connect to a real-time presence system
    const statuses: Record<string, boolean> = {};
    const lastSeen: Record<string, string> = {};
    
    ids.forEach(id => {
      if (id) {
        statuses[id] = Math.random() > 0.5; // Random for demo
        lastSeen[id] = new Date(Date.now() - Math.random() * 60000 * 30).toISOString(); // Random last seen within 30 mins
      }
    });

    setOnlineStatuses(statuses);
    setLastSeenDates(lastSeen);

    const interval = setInterval(() => {
      const newStatuses: Record<string, boolean> = {};
      ids.forEach(id => {
        if (id) {
          newStatuses[id] = Math.random() > 0.3;
        }
      });
      setOnlineStatuses(newStatuses);
    }, 30000);

    return () => clearInterval(interval);
  }, [userIds, user]);

  const isUserOnline = (userId: string) => onlineStatuses[userId] || false;
  const getUserLastSeen = (userId: string) => lastSeenDates[userId];

  return { 
    isUserOnline, 
    getUserLastSeen,
    isOnline: false, // For backward compatibility
    lastSeen: new Date() // For backward compatibility
  };
};
