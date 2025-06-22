
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  Sparkles,
  Heart,
  Bell,
  Clock,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { useI18n } from "@/shared/hooks/useI18n";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/features/auth/hooks/useAuth";

interface DashboardHeaderProps {
  user: AuthUser | null;
  profile: any;
}

const DashboardHeader = ({ user, profile }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { isRTL } = useI18n();

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'buddy';

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const formatTimeDistance = (timeString: string) => {
    try {
      return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Card className="p-6">
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Welcome Section */}
          <div className="flex-1">
            <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  Welcome back, {userName}!
                </h1>
                <p className="text-gray-500 text-lg">
                  Ready to continue your fitness journey?
                </p>
              </div>
            </div>
            
            {/* Real Data Stats */}
            <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="px-3 py-1.5 text-sm border-gray-200">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Health Tracking Active
              </Badge>
              {profile?.ai_generations_remaining !== undefined && (
                <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  AI Credits: {profile.ai_generations_remaining}/5
                </Badge>
              )}
            </div>
          </div>

          {/* Simplified Action Area with Notifications */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full w-10 h-10"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "start" : "end"}
                className="w-80 p-0 bg-white border border-gray-200 shadow-xl rounded-xl z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/notifications')}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      View All
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {(!notifications || notifications.length === 0) ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
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
          </div>
        </div>
    </Card>
  );
};

export default DashboardHeader;
