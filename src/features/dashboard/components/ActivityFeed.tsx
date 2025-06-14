
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useI18n } from "@/hooks/useI18n";
import { formatDistanceToNow } from "date-fns";
import { Activity, Scale, Utensils, Dumbbell, Clock, TrendingUp } from "lucide-react";

interface ActivityFeedProps {
  mealPlans: any[] | null;
  programs: any[] | null;
}

const ActivityFeed = ({ mealPlans, programs }: ActivityFeedProps) => {
  const { weightEntries } = useWeightTracking();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'weight': return Scale;
      case 'meal': return Utensils;
      case 'exercise': return Dumbbell;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'weight': return { icon: 'text-blue-600', bg: 'bg-blue-50' };
      case 'meal': return { icon: 'text-green-600', bg: 'bg-green-50' };
      case 'exercise': return { icon: 'text-purple-600', bg: 'bg-purple-50' };
      default: return { icon: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const activities = [
    ...(weightEntries?.slice(0, 3).map(entry => ({
      type: 'weight',
      title: `${String(tDashboard('recentActivity.loggedWeight'))}: ${entry.weight} ${String(tDashboard('common.kg'))}`,
      time: entry.recorded_at,
      badge: String(tDashboard('recentActivity.badges.weight')),
      description: new Date(entry.recorded_at).toLocaleDateString()
    })) || []),
    ...(mealPlans?.slice(0, 2).map(plan => ({
      type: 'meal',
      title: `${String(tDashboard('recentActivity.createdMealPlan'))} ${new Date(plan.week_start_date).toLocaleDateString()}`,
      time: plan.created_at,
      badge: String(tDashboard('recentActivity.badges.nutrition')),
      description: String(tDashboard('recentActivity.weeklyMealPlan'))
    })) || []),
    ...(programs?.slice(0, 2).map(program => ({
      type: 'exercise',
      title: `${String(tDashboard('recentActivity.createdProgram'))} ${program.program_name}`,
      time: program.created_at,
      badge: String(tDashboard('recentActivity.badges.exercise')),
      description: `${program.workout_type} ${String(tDashboard('recentActivity.program'))}`
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  if (activities.length === 0) {
    return (
      <Card className="p-4 bg-white border border-gray-100 shadow-sm">
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {String(tDashboard('recentActivity.title'))}
          </h3>
        </div>
        
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">{String(tDashboard('recentActivity.noActivity'))}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white border border-gray-100 shadow-sm">
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">
          {String(tDashboard('recentActivity.title'))}
        </h3>
      </div>
      
      <div className="space-y-2">
        {activities.slice(0, 4).map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type);
          const colors = getActivityColor(activity.type);
          return (
            <div key={index} className={`flex items-start gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <IconComponent className={`w-3 h-3 ${colors.icon}`} />
              </div>
              
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-medium text-gray-800 text-xs break-words mb-1">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
                )}
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-white">
                    {activity.badge}
                  </Badge>
                  <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityFeed;
