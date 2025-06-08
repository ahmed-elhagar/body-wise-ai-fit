
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, Clock, AlertCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface NotificationWidgetProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationWidget = ({ 
  notifications, 
  onMarkAsRead, 
  onDismiss, 
  onMarkAllAsRead 
}: NotificationWidgetProps) => {
  const { t } = useI18n();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          {t('dashboard:notifications') || 'Notifications'}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            {t('dashboard:markAllAsRead') || 'Mark all as read'}
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {notifications.slice(0, 5).map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 rounded-lg border ${
              notification.isRead ? 'bg-gray-50' : 'bg-white border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    notification.isRead ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    notification.isRead ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1 ml-2">
                {!notification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('dashboard:noNotifications') || 'No notifications'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationWidget;
