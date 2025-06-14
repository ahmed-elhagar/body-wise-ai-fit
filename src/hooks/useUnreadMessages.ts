
import { useState } from 'react';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);

  return {
    unreadCount,
    unreadMessages
  };
};
