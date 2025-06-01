import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

const NotificationCenter = () => {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        message: t('notifications.welcome') || 'Welcome to FitFatta!',
        type: 'info',
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        message: t('notifications.mealPlanReady') || 'Your personalized meal plan is ready.',
        type: 'success',
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: '3',
        message: t('notifications.exerciseReminder') || 'Time for your daily workout!',
        type: 'warning',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    setNotifications(mockNotifications);
  }, [t]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Bell className="w-4 h-4 mr-2 inline-block align-middle" />
          {t('notifications.title') || 'Notifications'}
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('notifications.noNotifications') || 'No notifications yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.createdAt.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearNotification(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
