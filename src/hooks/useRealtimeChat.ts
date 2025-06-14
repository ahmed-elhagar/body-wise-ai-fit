
import { useState } from 'react';

export const useRealtimeChat = (coachId?: string, traineeId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  
  return {
    isConnected
  };
};
