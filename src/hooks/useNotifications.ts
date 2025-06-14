
import { useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const markAsRead = async (notificationId: string) => {
    setIsMarkingAsRead(true);
    try {
      console.log('Marking notification as read:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const markAllAsRead = async () => {
    setIsMarkingAllAsRead(true);
    try {
      console.log('Marking all notifications as read');
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead
  };
};
