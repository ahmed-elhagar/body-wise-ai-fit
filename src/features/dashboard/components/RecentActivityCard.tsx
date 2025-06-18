
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentActivity } from "../hooks";
import { 
  UtensilsCrossed, 
  Dumbbell, 
  Scale, 
  Target,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const iconMap = {
  UtensilsCrossed,
  Dumbbell,
  Scale,
  Target
};

export const RecentActivityCard = () => {
  const { recentActivity } = useRecentActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No recent activity. Start by logging a meal or workout!
          </p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = iconMap[activity.icon as keyof typeof iconMap];
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {IconComponent && <IconComponent className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
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
