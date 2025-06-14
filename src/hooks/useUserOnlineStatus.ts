
import { useState } from 'react';

export const useUserOnlineStatus = (userIds: string[]) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const isUserOnline = (userId: string) => onlineUsers.has(userId);
  
  const getUserLastSeen = (userId: string) => {
    return new Date(); // Mock last seen
  };

  return {
    isUserOnline,
    getUserLastSeen
  };
};
