
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserOnlineStatus = (userId?: string) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId || !user) {
      setIsOnline(false);
      setLastSeen(null);
      return;
    }

    // Simple implementation - in a real app, this would connect to a real-time presence system
    setIsOnline(Math.random() > 0.5); // Random for demo
    setLastSeen(new Date(Date.now() - Math.random() * 60000 * 30)); // Random last seen within 30 mins

    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, user]);

  return { isOnline, lastSeen };
};
