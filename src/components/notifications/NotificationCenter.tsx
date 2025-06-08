
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, MoreHorizontal, Clock, MessageSquare, Users, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface Notification {
  id: string;
  type: 'meal' | 'exercise' | 'social' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter = () => {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'meal',
      title: t('Meal Reminder'),
      message: t('Time for your afternoon snack!'),
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'exercise',
      title: t('Workout Complete'),
      message: t('Great job on completing your morning workout!'),
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '3',
      type: 'achievement',
      title: t('Achievement Unlocked'),
      message: t('You\'ve completed 7 days of consistent meal logging!'),
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: '4',
      type: 'social',
      title: t('Coach Message'),
      message: t('Your coach has reviewed your progress and left feedback.'),
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'exercise': return <Target className="w-4 h-4 text-blue-600" />;
      case 'social': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'achievement': return <Users className="w-4 h-4 text-purple-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-blue-600" />
            {t('Notifications')}
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              {t('Mark all read')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
              notification.read 
                ? 'bg-gray-50 border-gray-100' 
                : 'bg-white border-blue-200 shadow-sm'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${
                    notification.read ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(notification.priority)}`}
                    >
                      {notification.priority}
                    </Badge>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className={`text-sm ${
                  notification.read ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatTimestamp(notification.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t('No notifications yet')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
