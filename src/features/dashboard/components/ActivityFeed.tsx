import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import { useI18n } from "@/hooks/useI18n";
import { formatDistanceToNow } from "date-fns";
import { Activity, Scale, Utensils, Dumbbell, Clock, TrendingUp } from "lucide-react";

interface ActivityFeedProps {
  mealPlans: any[] | null;
  programs: any[] | null;
}

const ActivityFeed = ({ mealPlans, programs }: ActivityFeedProps) => {
  const { entries: weightEntries } = useWeightTracking();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'weight': return 'bg-blue-100 text-blue-800';
      case 'meal': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">{String(tDashboard('recentActivity.noActivity'))}</p>
            <p className="text-gray-400 text-xs">Complete actions to see them here.</p>
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-0 h-full w-0.5 bg-gray-200" />
            <div className="space-y-8">
              {activities.map((activity, index) => {
                 const dotColorClass = getActivityColor(activity.type).replace('-100', '-500').replace('text-blue-800','bg-blue-500').replace('text-green-800','bg-green-500').replace('text-purple-800','bg-purple-500').replace('text-gray-800','bg-gray-500');

                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="absolute -left-[18px] top-1.5 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                       <div className={`w-3 h-3 rounded-full ${dotColorClass}`} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                         <Badge variant="secondary" className={`text-xs px-2 py-0.5 font-normal border-0 ${getActivityColor(activity.type)}`}>
                           {activity.badge}
                         </Badge>
                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
                           <Clock className="w-3 h-3" />
                           <span>{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
