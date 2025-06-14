
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityItem {
  id: string;
  type: 'workout' | 'meal' | 'weight';
  description: string;
  timestamp: Date;
  status?: 'completed' | 'in_progress' | 'planned';
}

interface RecentActivityCardProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export const RecentActivityCard = ({ activities = [], isLoading = false }: RecentActivityCardProps) => {
  const { t, isRTL } = useLanguage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">{t('dashboard.noRecentActivity')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return '🏋️';
      case 'meal':
        return '🍽️';
      case 'weight':
        return '⚖️';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {t('dashboard.recentActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleDateString()}
                </p>
              </div>
              {activity.status && (
                <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                  {t(`dashboard.status.${activity.status}`)}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
