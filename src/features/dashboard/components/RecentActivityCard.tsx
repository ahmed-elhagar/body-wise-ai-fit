
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  TrendingUp, 
  Utensils, 
  Dumbbell,
  Calendar,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";

const RecentActivityCard = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useI18n();

  // Mock recent activity data - in real app this would come from hooks
  const recentActivities = [
    {
      id: 1,
      type: 'meal',
      title: 'Breakfast logged',
      description: 'Greek yogurt with berries',
      time: '2 hours ago',
      calories: 280,
      icon: Utensils,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'workout',
      title: 'Morning workout completed',
      description: '45 min strength training',
      time: '3 hours ago',
      duration: '45 min',
      icon: Dumbbell,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'goal',
      title: 'Weekly goal achieved',
      description: 'Completed 5 workouts this week',
      time: '1 day ago',
      progress: '100%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Recent Activity</span>
          </CardTitle>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View All
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activity</h3>
            <p className="text-gray-500 mb-4">Start your fitness journey today!</p>
            <Button
              onClick={() => navigate('/meal-plan')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                  onClick={() => {
                    if (activity.type === 'meal') navigate('/food-tracker');
                    else if (activity.type === 'workout') navigate('/exercise');
                    else navigate('/progress');
                  }}
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <IconComponent className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className={`flex items-center gap-4 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.calories && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.calories} cal
                        </Badge>
                      )}
                      {activity.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.duration}
                        </Badge>
                      )}
                      {activity.progress && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          {activity.progress}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight className={`w-5 h-5 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
