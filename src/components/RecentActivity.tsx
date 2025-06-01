
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { ActivityItem, EmptyActivityState, useActivityData } from "./recent-activity";

const RecentActivity = () => {
  const { t, isRTL } = useI18n();
  const { activities } = useActivityData();

  if (activities.length === 0) {
    return (
      <Card className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
        <h3 className={`text-xl font-semibold text-health-text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('recentActivity.title')}
        </h3>
        <EmptyActivityState />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
      <h3 className={`text-xl font-semibold text-health-text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('recentActivity.title')}
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            activity={activity}
            isRTL={isRTL}
          />
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
