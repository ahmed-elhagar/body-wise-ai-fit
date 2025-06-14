
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Activity, 
  TrendingUp,
  Sparkles,
  Heart,
  Bell,
  Clock,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useI18n } from "@/hooks/useI18n";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  user: AuthUser | null;
  profile: any;
}

const DashboardHeader = ({ user, profile }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');

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
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-xl rounded-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
      
      <div className="relative p-6 md:p-8">
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Welcome Section */}
          <div className="flex-1">
            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  Welcome back, {userName}!
                </h1>
                <p className="text-white/80 text-lg">
                  Ready to continue your fitness journey?
                </p>
              </div>
            </div>
            
            {/* Real Data Stats */}
            <div className={`flex flex-wrap gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5">
                <Heart className="w-4 h-4 mr-2" />
                Health Tracking Active
              </Badge>
              {profile?.ai_generations_remaining !== undefined && (
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 px-3 py-1.5">
                  <TrendingUp className="w-4 h-4 mr-2" />
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
                  size="sm"
                  className="relative bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  <Bell className="w-4 h-4" />
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

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
