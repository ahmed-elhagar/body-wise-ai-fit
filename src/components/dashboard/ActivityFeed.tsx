
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { Activity, Scale, Utensils, Dumbbell, Clock, TrendingUp } from "lucide-react";

const ActivityFeed = () => {
  const { weightEntries } = useWeightTracking();
  const { mealPlans } = useMealPlans();
  const { programs } = useExercisePrograms();
  const { t, isRTL } = useLanguage();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'weight': return Scale;
      case 'meal': return Utensils;
      case 'exercise': return Dumbbell;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'weight': return 'bg-blue-500';
      case 'meal': return 'bg-green-500';
      case 'exercise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const activities = [
    ...(weightEntries?.slice(0, 3).map(entry => ({
      type: 'weight',
      title: `${t('recentActivity.loggedWeight')}: ${entry.weight} ${t('common.kg')}`,
      time: entry.recorded_at,
      badge: t('recentActivity.badges.weight'),
      description: new Date(entry.recorded_at).toLocaleDateString()
    })) || []),
    ...(mealPlans?.slice(0, 2).map(plan => ({
      type: 'meal',
      title: `${t('recentActivity.createdMealPlan')} ${new Date(plan.week_start_date).toLocaleDateString()}`,
      time: plan.created_at,
      badge: t('recentActivity.badges.nutrition'),
      description: `Weekly meal plan`
    })) || []),
    ...(programs?.slice(0, 2).map(program => ({
      type: 'exercise',
      title: `${t('recentActivity.createdProgram')} ${program.program_name}`,
      time: program.created_at,
      badge: t('recentActivity.badges.exercise'),
      description: `${program.workout_type} program`
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  if (activities.length === 0) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-fitness-gradient rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            {t('recentActivity.title')}
          </h3>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">{t('recentActivity.noActivity')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 bg-fitness-gradient rounded-xl flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          {t('recentActivity.title')}
        </h3>
      </div>
      
      <div className="space-y-3">
        {activities.slice(0, 4).map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-medium text-gray-800 text-sm break-words mb-1">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-xs text-gray-500 mb-2">{activity.description}</p>
                )}
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {activity.badge}
                  </Badge>
                  <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityFeed;
