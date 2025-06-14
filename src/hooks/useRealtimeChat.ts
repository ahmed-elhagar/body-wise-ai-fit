
import { useState } from 'react';

export const useRealtimeChat = () => {
  const [isConnected, setIsConnected] = useState(true);

  return {
    isConnected
  };
};
