
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Calendar,
  Award
} from "lucide-react";

const EnhancedStatsGrid = () => {
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();
  const { weightEntries } = useWeightTracking();

  // Calculate weight progress
  const currentWeight = weightEntries?.[0]?.weight || profile?.weight || 0;
  const targetWeight = profile?.weight ? profile.weight - 5 : 70; // Assuming 5kg loss goal
  const weightProgress = currentWeight > 0 ? Math.max(0, Math.min(100, ((profile?.weight || 75) - currentWeight) / 5 * 100)) : 0;

  // Mock data for demonstration - in real app, this would come from actual user data
  const todaysCalories = 1847;
  const targetCalories = 2200;
  const calorieProgress = (todaysCalories / targetCalories) * 100;

  const weeklyWorkouts = 4;
  const targetWorkouts = 5;
  const workoutProgress = (weeklyWorkouts / targetWorkouts) * 100;

  const overallGoalProgress = 87;

  const stats = [
    {
      title: t('dashboard.currentWeight'),
      value: currentWeight.toString(),
      unit: "kg",
      progress: weightProgress,
      target: `Goal: ${targetWeight}kg`,
      icon: Scale,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      progressColor: "bg-blue-500"
    },
    {
      title: t('dashboard.todayCalories'),
      value: todaysCalories.toLocaleString(),
      unit: "kcal",
      progress: calorieProgress,
      target: `Target: ${targetCalories} kcal`,
      icon: Flame,
      gradient: "from-orange-500 to-red-500", 
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      progressColor: "bg-orange-500"
    },
    {
      title: t('dashboard.workoutsWeek'),
      value: weeklyWorkouts.toString(),
      unit: "sessions",
      progress: workoutProgress,
      target: `Goal: ${targetWorkouts} sessions`,
      icon: Dumbbell,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50", 
      borderColor: "border-purple-200",
      progressColor: "bg-purple-500"
    },
    {
      title: t('dashboard.goalProgress'),
      value: overallGoalProgress.toString(),
      unit: "%",
      progress: overallGoalProgress,
      target: "This month",
      icon: Target,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      progressColor: "bg-emerald-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;

        return (
          <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl p-3 sm:p-4 lg:p-6 h-full`}>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className={`flex items-center justify-between mb-2 sm:mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className={`text-right flex-1 min-w-0 ml-2 ${isRTL ? 'text-left ml-0 mr-2' : ''}`}>
                  <div className="text-xs sm:text-sm text-gray-600 font-semibold truncate">
                    {stat.title}
                  </div>
                </div>
              </div>

              {/* Main Value */}
              <div className={`mb-2 sm:mb-3 flex-1 flex items-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-baseline gap-1 w-full">
                  <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 truncate">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0">
                    {stat.unit}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <Progress 
                  value={stat.progress} 
                  className="h-1.5 sm:h-2 bg-gray-200"
                />
              </div>

              {/* Target Info */}
              <div className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                {stat.target}
              </div>

              {/* Achievement Badge */}
              {stat.progress >= 100 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-100 text-yellow-800 animate-pulse text-xs p-1">
                    <Award className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5" />
                    <span className="hidden sm:inline">Goal!</span>
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedStatsGrid;
