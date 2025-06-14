
import { useState } from 'react';

export const useCoachChat = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    conversations,
    isLoading
  };
};
