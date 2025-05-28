
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
      color: 'bg-blue-500'
    })) || []),
    ...(mealPlans?.slice(0, 2).map(plan => ({
      type: 'meal',
      title: `${t('recentActivity.createdMealPlan')} ${new Date(plan.week_start_date).toLocaleDateString()}`,
      time: plan.created_at,
      badge: t('recentActivity.badges.nutrition'),
      color: 'bg-green-500'
    })) || []),
    ...(programs?.slice(0, 2).map(program => ({
      type: 'exercise',
      title: `${t('recentActivity.createdProgram')} ${program.program_name} ${t('recentActivity.program')}`,
      time: program.created_at,
      badge: t('recentActivity.badges.exercise'),
      color: 'bg-purple-500'
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  if (activities.length === 0) {
    return (
      <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className={`text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('recentActivity.title')}
        </h3>
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm sm:text-base">{t('recentActivity.noActivity')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className={`text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('recentActivity.title')}
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-800 break-words">{activity.title}</p>
              <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <Badge variant="secondary" className="text-xs">
                  {activity.badge}
                </Badge>
                <p className="text-xs text-gray-500">
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
