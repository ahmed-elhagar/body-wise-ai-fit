
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { 
  Scale, 
  Flame,
  Dumbbell, 
  Target
} from "lucide-react";

const EnhancedStatsGrid = () => {
  const { t, isRTL } = useI18n();
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
          progress: 'bg-orange-500',
          text: 'text-orange-700'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'from-blue-500 to-indigo-500',
          progress: 'bg-blue-500',
          text: 'text-blue-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'from-purple-500 to-pink-500',
          progress: 'bg-purple-500',
          text: 'text-purple-700'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'from-green-500 to-emerald-500',
          progress: 'bg-green-500',
          text: 'text-green-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'from-gray-500 to-gray-600',
          progress: 'bg-gray-500',
          text: 'text-gray-700'
        };
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isRTL ? 'rtl' : ''}`}>
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} className={`${colors.bg} ${colors.border} border-2 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {stat.value}
                    <span className="text-sm font-normal">{stat.unit}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-white/70 rounded-full h-2">
                  <div 
                    className={`${colors.progress} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{Math.round(stat.progress)}%</span>
                  <span>{stat.target}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-sm font-semibold ${colors.text}`}>
                {stat.title}
              </h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedStatsGrid;
