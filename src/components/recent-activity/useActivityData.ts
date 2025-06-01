
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useLanguage } from "@/contexts/LanguageContext";

export const useActivityData = () => {
  const { weightEntries } = useWeightTracking();
  const { mealPlans } = useMealPlans();
  const { programs } = useExercisePrograms();
  const { t } = useLanguage();

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

  return { activities };
};
