
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/features/profile";
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
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'from-orange-500 to-red-500',
          progress: 'bg-orange-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'from-blue-500 to-cyan-500',
          progress: 'bg-blue-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'from-purple-500 to-indigo-500',
          progress: 'bg-purple-500'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'from-green-500 to-emerald-500',
          progress: 'bg-green-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'from-gray-500 to-gray-600',
          progress: 'bg-gray-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const colors = getColorClasses(stat.color);

        return (
          <Card key={index} className={`relative overflow-hidden ${colors.bg} border ${colors.border} shadow-md hover:shadow-lg transition-all duration-200 rounded-xl p-3`}>
            {/* Content */}
            <div className="relative">
              {/* Header */}
              <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 bg-gradient-to-br ${colors.icon} rounded-lg flex items-center justify-center shadow-sm`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Value */}
              <div className={`mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-800">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {stat.unit}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-2">
                <Progress 
                  value={stat.progress} 
                  className="h-1.5 bg-gray-200"
                />
              </div>

              {/* Title & Target */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.target}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedStatsGrid;
