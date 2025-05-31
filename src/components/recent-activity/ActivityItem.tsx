
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: {
    type: string;
    title: string;
    time: string;
    badge: string;
    color: string;
  };
  isRTL: boolean;
}

export const ActivityItem = ({ activity, isRTL }: ActivityItemProps) => {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl bg-health-soft ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
        <p className="text-sm font-medium text-health-text-primary break-words">{activity.title}</p>
        <div className={`flex items-center gap-3 mt-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <Badge variant="secondary" className="text-xs bg-white border-health-border text-health-primary">
            {activity.badge}
          </Badge>
          <p className="text-xs text-health-text-secondary">
            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};
