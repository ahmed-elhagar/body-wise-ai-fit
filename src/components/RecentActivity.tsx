
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { Clock, CheckCircle, Utensils, Dumbbell } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'meal' | 'workout' | 'goal';
  title: string;
  time: string;
  completed: boolean;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  const { t, isRTL } = useI18n();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-4 h-4 text-green-500" />;
      case 'workout': return <Dumbbell className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('dashboard:recentActivity.title')}
      </h3>
      
      {activities.length === 0 ? (
        <div className={`text-center py-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('dashboard:recentActivity.noActivity')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              {getActivityIcon(activity.type)}
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
