
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { 
  Scale, 
  Flame,
  Dumbbell, 
  Target
} from "lucide-react";

const EnhancedStatsGrid = () => {
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();
  const { weightEntries } = useWeightTracking();

  // Calculate current weight and progress
  const currentWeight = weightEntries?.[0]?.weight || profile?.weight || 0;
  const targetWeight = profile?.weight ? profile.weight - 5 : 70;
  const weightProgress = currentWeight > 0 ? Math.max(0, Math.min(100, ((profile?.weight || 75) - currentWeight) / 5 * 100)) : 0;

  // Daily focus metrics
  const todaysCalories = 1847;
  const targetCalories = 2200;
  const calorieProgress = (todaysCalories / targetCalories) * 100;

  const todaysWorkouts = 2;
  const targetWorkouts = 3;
  const workoutProgress = (todaysWorkouts / targetWorkouts) * 100;

  const overallProgress = 73;

  const stats = [
    {
      title: t('Today\'s Calories'),
      value: todaysCalories.toLocaleString(),
      unit: "cal",
      progress: calorieProgress,
      target: `${targetCalories} goal`,
      icon: Flame,
      color: "orange"
    },
    {
      title: t('Current Weight'),
      value: currentWeight.toFixed(1),
      unit: "kg",
      progress: weightProgress,
      target: `${targetWeight}kg goal`,
      icon: Scale,
      color: "blue"
    },
    {
      title: t('Today\'s Workouts'),
      value: todaysWorkouts.toString(),
      unit: `/${targetWorkouts}`,
      progress: workoutProgress,
      target: "sessions planned",
      icon: Dumbbell,
      color: "purple"
    },
    {
      title: t('Weekly Progress'),
      value: overallProgress.toString(),
      unit: "%",
      progress: overallProgress,
      target: "overall goal",
      icon: Target,
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          text: 'text-orange-600',
          icon: 'from-orange-500 to-red-500',
          progress: 'bg-gradient-to-r from-orange-400 to-red-500'
        };
      case 'blue':
        return {
          text: 'text-blue-600',
          icon: 'from-blue-500 to-cyan-500',
          progress: 'bg-gradient-to-r from-blue-400 to-cyan-500'
        };
      case 'purple':
        return {
          text: 'text-purple-600',
          icon: 'from-purple-500 to-indigo-500',
          progress: 'bg-gradient-to-r from-purple-400 to-indigo-500'
        };
      case 'green':
        return {
          text: 'text-green-600',
          icon: 'from-green-500 to-emerald-500',
          progress: 'bg-gradient-to-r from-green-400 to-emerald-500'
        };
      default:
        return {
          text: 'text-gray-600',
          icon: 'from-gray-500 to-gray-600',
          progress: 'bg-gradient-to-r from-gray-400 to-gray-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const colors = getColorClasses(stat.color);

        return (
          <Card key={index} className="relative overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="p-5">
              <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${colors.text}`}>
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {stat.unit}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                   <span>{t('Goal')}: {stat.target}</span>
                   <span>{`${Math.round(stat.progress)}%`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${colors.progress}`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedStatsGrid;
