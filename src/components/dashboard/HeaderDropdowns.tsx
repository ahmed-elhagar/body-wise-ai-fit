
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Activity, Clock, ArrowRight } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const HeaderDropdowns = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Use safe destructuring with fallbacks
  const { 
    notifications = [], 
    unreadCount = 0,
    isLoading: notificationsLoading 
  } = useNotifications() || {};
  
  const { weightEntries = [] } = useWeightTracking() || {};
  const { mealPlans = [] } = useMealPlans() || {};
  const { programs = [] } = useExercisePrograms() || {};

  // Recent activities with null safety
  const activities = [
    ...(weightEntries?.slice(0, 2)?.map(entry => ({
      type: 'weight',
      title: `Logged weight: ${entry?.weight || 0} kg`,
      time: entry?.recorded_at || new Date().toISOString(),
      icon: '⚖️'
    })) || []),
    ...(mealPlans?.slice(0, 2)?.map(plan => ({
      type: 'meal',
      title: `Created meal plan`,
      time: plan?.created_at || new Date().toISOString(),
      icon: '🍽️'
    })) || []),
    ...(programs?.slice(0, 2)?.map(program => ({
      type: 'exercise',
      title: `Created ${program?.program_name || 'exercise program'}`,
      time: program?.created_at || new Date().toISOString(),
      icon: '💪'
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

  const handleNotificationClick = (notification: any) => {
    try {
      if (notification?.action_url) {
        navigate(notification.action_url);
      }
    } catch (error) {
      console.error('❌ Error navigating to notification action:', error);
    }
  };

  const formatTimeDistance = (timeString: string) => {
    try {
      return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    } catch (error) {
      console.error('❌ Error formatting time:', error);
      return 'Recently';
    }
  };

  if (notificationsLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Bell className="w-4 h-4 text-blue-600" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-80 p-0 bg-white border border-gray-200 shadow-xl rounded-xl z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{t('Notifications')}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {t('View All')}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('No new notifications')}</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification?.id || Math.random()}
                  className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification?.is_read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {notification?.title || 'Notification'}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification?.message || ''}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTimeDistance(notification?.created_at || new Date().toISOString())}</span>
                      </div>
                    </div>
                    {!notification?.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 ml-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Activity Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
          >
            <Activity className="w-4 h-4 text-green-600" />
            {activities.length > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center bg-green-100 text-green-700"
              >
                {activities.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-80 p-0 bg-white border border-gray-200 shadow-xl rounded-xl z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{t('Recent Activity')}</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('No recent activity')}</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={`${activity.type}-${index}`}
                  className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTimeDistance(activity.time)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;
