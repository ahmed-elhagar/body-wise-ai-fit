
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Zap, 
  Calendar, 
  Award, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentActivityCard = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Workout Completed",
      description: "Upper body strength training",
      icon: Zap,
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Meal Plan Updated",
      description: "New recipes for this week",
      icon: Calendar,
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Goal Achievement",
      description: "Weekly target reached!",
      icon: Award,
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Today
          </Badge>
        </div>
        
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className={`flex items-center gap-3 p-3 ${activity.bgColor} rounded-lg`}>
                <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-sm" 
          onClick={() => navigate('/progress')}
        >
          View All Activity
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
