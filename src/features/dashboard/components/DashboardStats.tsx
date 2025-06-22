
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GradientStatsCard } from '@/shared/components/design-system';
import { Flame, Dumbbell, Droplets, Activity } from 'lucide-react';

interface DashboardStatsProps {
  todayStats: {
    caloriesConsumed: number;
    caloriesGoal: number;
    proteinConsumed: number;
    proteinGoal: number;
    waterIntake: number;
    waterGoal: number;
    completedExercises: number;
    totalExercises: number;
    stepsCount: number;
    stepsGoal: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ todayStats }) => {
  const { t } = useTranslation(['dashboard', 'common']);

  // Calculate progress percentages
  const caloriesProgress = todayStats.caloriesGoal > 0 ? (todayStats.caloriesConsumed / todayStats.caloriesGoal) * 100 : 0;
  const proteinProgress = todayStats.proteinGoal > 0 ? (todayStats.proteinConsumed / todayStats.proteinGoal) * 100 : 0;
  const waterProgress = todayStats.waterGoal > 0 ? (todayStats.waterIntake / todayStats.waterGoal) * 100 : 0;
  const workoutProgress = todayStats.totalExercises > 0 ? (todayStats.completedExercises / todayStats.totalExercises) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GradientStatsCard
        title={t('todayCalories')}
        stats={[{
          label: t('consumed'),
          value: Math.round(todayStats.caloriesConsumed).toLocaleString(),
          color: 'orange' as const,
          change: {
            value: Math.round(caloriesProgress),
            isPositive: caloriesProgress <= 100
          }
        }]}
      />
      
      <GradientStatsCard
        title="Protein"
        stats={[{
          label: t('consumed'),
          value: `${Math.round(todayStats.proteinConsumed)}g`,
          color: 'green' as const,
          change: {
            value: Math.round(proteinProgress),
            isPositive: proteinProgress >= 80
          }
        }]}
      />
      
      <GradientStatsCard
        title="Water"
        stats={[{
          label: t('daily_progress'),
          value: `${todayStats.waterIntake}/${todayStats.waterGoal}`,
          color: 'blue' as const,
          change: {
            value: Math.round(waterProgress),
            isPositive: true
          }
        }]}
      />
      
      <GradientStatsCard
        title={t('workoutsWeek')}
        stats={[{
          label: "Today",
          value: todayStats.totalExercises === 0 
            ? "No workout" 
            : `${todayStats.completedExercises}/${todayStats.totalExercises}`,
          color: 'purple' as const,
          change: {
            value: Math.round(workoutProgress),
            isPositive: true
          }
        }]}
      />
    </div>
  );
};

export default DashboardStats;
