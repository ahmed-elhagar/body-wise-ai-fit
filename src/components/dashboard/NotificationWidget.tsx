
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, ArrowRight, Clock, Apple, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationWidget = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Sample recent notifications
  const recentNotifications = [
    {
      id: '1',
      type: 'meal',
      title: t('Lunch Reminder'),
      time: '12:30 PM',
      priority: 'medium',
      icon: Apple
    },
    {
      id: '2',
      type: 'exercise',
      title: t('Workout Time'),
      time: '2:30 PM',
      priority: 'high',
      icon: Dumbbell
    }
  ];

  const unreadCount = 2;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-blue-600" />
            {t('Recent Notifications')}
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            {t('View All')}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentNotifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t('No new notifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map(notification => (
              <div
                key={notification.id}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <notification.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {notification.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </div>
                </div>
                <Badge className={`text-xs ${
                  notification.priority === 'high' 
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {notification.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100">
          <Button
            onClick={() => navigate('/notifications')}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Bell className="w-3 h-3 mr-1" />
            {t('Manage Notifications')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationWidget;
