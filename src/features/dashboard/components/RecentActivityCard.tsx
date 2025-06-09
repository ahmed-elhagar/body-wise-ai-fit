
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
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/features/meal-plan/hooks";
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
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Recent Activity</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300"
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-10 h-10 text-gray-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">No recent activity</h3>
                <p className="text-sm">Start tracking your fitness journey!</p>
                <div className="flex gap-3 justify-center mt-6">
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/food-tracker')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg"
                  >
                    <Utensils className="w-3 h-3 mr-2" />
                    Track Food
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/exercise')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg"
                  >
                    <Dumbbell className="w-3 h-3 mr-2" />
                    Start Workout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={`${activity.type}-${index}`}
                className={`p-4 rounded-xl border border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300 cursor-pointer group ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={activity.action}
              >
                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="font-semibold text-gray-800 truncate text-sm">
                        {activity.title}
                      </p>
                      <Badge variant="outline" className={`text-xs ${activity.color} border-0 rounded-lg px-3 py-1`}>
                        {activity.type}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 text-xs text-gray-500 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeDistance(activity.time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Quick Stats Summary */}
        {activities.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-blue-900 mb-1">{weightEntries?.length || 0}</div>
                <div className="text-xs text-blue-600 font-medium">Weight Logs</div>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mt-2 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-green-900 mb-1">{mealPlans?.length || 0}</div>
                <div className="text-xs text-green-600 font-medium">Meal Plans</div>
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mx-auto mt-2 group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-purple-900 mb-1">{programs?.length || 0}</div>
                <div className="text-xs text-purple-600 font-medium">Programs</div>
                <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mt-2 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
