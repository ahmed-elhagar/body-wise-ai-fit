
import { useState } from 'react';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return {
    unreadCount,
    isLoading
  };
};

export const useUnreadMessagesByTrainee = () => {
  const [unreadMessagesByTrainee, setUnreadMessagesByTrainee] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  return {
    unreadMessagesByTrainee,
    isLoading
  };
};
