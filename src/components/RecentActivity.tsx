
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const { weightEntries } = useWeightTracking();
  const { mealPlans } = useMealPlans();
  const { programs } = useExercisePrograms();
  const { t, isRTL } = useLanguage();

  const activities = [
    ...(weightEntries?.slice(0, 3).map(entry => ({
      type: 'weight',
      title: `${t('recentActivity.loggedWeight')}: ${entry.weight} ${t('common.kg')}`,
      time: entry.recorded_at,
      badge: t('recentActivity.badges.weight'),
      color: 'bg-health-primary'
    })) || []),
    ...(mealPlans?.slice(0, 2).map(plan => ({
      type: 'meal',
      title: `${t('recentActivity.createdMealPlan')} ${new Date(plan.week_start_date).toLocaleDateString()}`,
      time: plan.created_at,
      badge: t('recentActivity.badges.nutrition'),
      color: 'bg-health-accent'
    })) || []),
    ...(programs?.slice(0, 2).map(program => ({
      type: 'exercise',
      title: `${t('recentActivity.createdProgram')} ${program.program_name} ${t('recentActivity.program')}`,
      time: program.created_at,
      badge: t('recentActivity.badges.exercise'),
      color: 'bg-health-secondary'
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  if (activities.length === 0) {
    return (
      <Card className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
        <h3 className={`text-xl font-semibold text-health-text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('recentActivity.title')}
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-health-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-health-text-secondary">{t('recentActivity.noActivity')}</p>
        </div>
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
          <div key={index} className={`flex items-start gap-4 p-4 rounded-xl bg-health-soft ${isRTL ? 'flex-row-reverse' : ''}`}>
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
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
