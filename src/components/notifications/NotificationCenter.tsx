
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Trophy, Calendar, MessageSquare, ArrowRight, ChefHat } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationCenter = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead 
  } = useNotifications();

  const getNotificationIcon = (type: string, message?: string) => {
    // Special case for meal plan notifications
    if (message?.includes('meal plan') || message?.includes('خطة الوجبات')) {
      return ChefHat;
    }
    
    switch (type) {
      case 'achievement': return Trophy;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'reminder': return Calendar;
      default: return MessageSquare;
    }
  };

  const getNotificationColor = (type: string, message?: string) => {
    // Special styling for meal plan notifications
    if (message?.includes('meal plan') || message?.includes('خطة الوجبات')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'warning': return 'bg-red-100 text-red-800 border-red-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'reminder': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read if unread
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      navigate(notification.action_url);
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
              const IconComponent = getNotificationIcon(notification.type, notification.message);
              const isUnread = !notification.is_read;
              const isChatNotification = notification.metadata?.chat_type === 'coach_trainee';
              const isMealPlanNotification = notification.message?.includes('meal plan') || notification.message?.includes('خطة الوجبات');
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    isUnread 
                      ? isMealPlanNotification 
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.message)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isMealPlanNotification ? 'bg-green-500' : 'bg-blue-500'
                            }`}></div>
                          )}
                          {(isChatNotification || isMealPlanNotification) && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {isChatNotification && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Chat Message
                          </Badge>
                        </div>
                      )}
                      {isMealPlanNotification && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            Meal Plan Ready
                          </Badge>
                        </div>
                      )}
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
