
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  ArrowRight,
  Utensils,
  Dumbbell,
  Target,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { formatDistanceToNow } from "date-fns";

const RecentActivityCard = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');
  
  // Get real data from hooks
  const { weightEntries = [] } = useWeightTracking() || {};
  const { mealPlans = [] } = useMealPlans() || {};
  const { programs = [] } = useExercisePrograms() || {};

  // Combine recent activities with null safety
  const activities = [
    ...(weightEntries?.slice(0, 2)?.map(entry => ({
      type: 'weight',
      title: `Logged weight: ${entry?.weight || 0} kg`,
      time: entry?.recorded_at || new Date().toISOString(),
      icon: '⚖️',
      color: 'bg-blue-100 text-blue-800',
      action: () => navigate('/progress')
    })) || []),
    ...(mealPlans?.slice(0, 2)?.map(plan => ({
      type: 'meal',
      title: `Created meal plan`,
      time: plan?.created_at || new Date().toISOString(),
      icon: '🍽️',
      color: 'bg-green-100 text-green-800',
      action: () => navigate('/meal-plan')
    })) || []),
    ...(programs?.slice(0, 2)?.map(program => ({
      type: 'exercise',
      title: `Created ${program?.program_name || 'exercise program'}`,
      time: program?.created_at || new Date().toISOString(),
      icon: '💪',
      color: 'bg-purple-100 text-purple-800',
      action: () => navigate('/exercise')
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const formatTimeDistance = (timeString: string) => {
    try {
      return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No recent activity</p>
              <p className="text-xs mt-1">Start tracking your fitness journey!</p>
              <div className="flex gap-2 justify-center mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/food-tracker')}
                  className="text-xs"
                >
                  <Utensils className="w-3 h-3 mr-1" />
                  Track Food
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/exercise')}
                  className="text-xs"
                >
                  <Dumbbell className="w-3 h-3 mr-1" />
                  Start Workout
                </Button>
              </div>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={`${activity.type}-${index}`}
                className={`p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={activity.action}
              >
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {activity.title}
                      </p>
                      <Badge variant="outline" className={`text-xs ${activity.color} border-0`}>
                        {activity.type}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 text-xs text-gray-500 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTimeDistance(activity.time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats Summary */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-900">{weightEntries?.length || 0}</div>
                <div className="text-xs text-blue-600">Weight Logs</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                <div className="text-lg font-bold text-green-900">{mealPlans?.length || 0}</div>
                <div className="text-xs text-green-600">Meal Plans</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-900">{programs?.length || 0}</div>
                <div className="text-xs text-purple-600">Programs</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
