
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Trophy, Calendar, MessageSquare } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const NotificationCenter = () => {
  const { t } = useLanguage();
  const { 
    notifications, 
    isLoading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'reminder': return Calendar;
      default: return MessageSquare;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'warning': return 'bg-red-100 text-red-800 border-red-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'reminder': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            {t('Notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            {t('Notifications')}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllAsRead}
            >
              {t('Mark All Read')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('No notifications yet')}</p>
              <p className="text-sm">{t('We\'ll notify you about important updates')}</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const isUnread = !notification.is_read;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isUnread 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h4>
                        {isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className={`text-sm ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
