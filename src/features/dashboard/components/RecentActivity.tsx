
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();

  // Sample activity data - this should be replaced with real data from hooks
  const activities = [
    {
      type: 'weight',
      title: 'Logged weight: 70 kg',
      time: new Date().toISOString(),
      icon: '⚖️',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'meal',
      title: 'Created meal plan',
      time: new Date(Date.now() - 3600000).toISOString(),
      icon: '🍽️',
      color: 'bg-green-100 text-green-800'
    }
  ];

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
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={`${activity.type}-${index}`}
                className={`p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
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
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
