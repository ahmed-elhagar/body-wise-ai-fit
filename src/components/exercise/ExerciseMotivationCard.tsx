
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Target, Star, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseMotivationCardProps {
  completedExercises: number;
  totalExercises: number;
  streak?: number;
  isRestDay?: boolean;
}

export const ExerciseMotivationCard = ({
  completedExercises,
  totalExercises,
  streak = 0,
  isRestDay = false
}: ExerciseMotivationCardProps) => {
  const { t } = useLanguage();

  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const getMotivationMessage = () => {
    if (isRestDay) {
      return {
        icon: Star,
        title: t('exercise.restDayMotivation') || "Recovery Day!",
        message: t('exercise.restDayMotivationMsg') || "Your muscles are rebuilding stronger. Great job taking care of yourself!",
        color: "from-orange-400 to-yellow-400",
        bgColor: "from-orange-50 to-yellow-50"
      };
    }

    if (progressPercentage === 100) {
      return {
        icon: Trophy,
        title: t('exercise.workoutComplete') || "Workout Complete!",
        message: t('exercise.workoutCompleteMsg') || "Amazing work! You've crushed today's workout. You're getting stronger every day!",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50"
      };
    }

    if (progressPercentage >= 75) {
      return {
        icon: Zap,
        title: t('exercise.almostThere') || "Almost There!",
        message: t('exercise.almostThereMsg') || "You're so close to finishing! Push through these last few exercises!",
        color: "from-blue-500 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50"
      };
    }

    if (progressPercentage >= 50) {
      return {
        icon: Target,
        title: t('exercise.halfwayThere') || "Halfway There!",
        message: t('exercise.halfwayThereMsg') || "Great momentum! You're doing fantastic. Keep up the excellent work!",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-50 to-pink-50"
      };
    }

    return {
      icon: TrendingUp,
      title: t('exercise.letsGo') || "Let's Get Started!",
      message: t('exercise.letsGoMsg') || "Ready to crush this workout? Every rep counts towards your fitness goals!",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    };
  };

  const motivation = getMotivationMessage();
  const IconComponent = motivation.icon;

  return (
    <Card className={`p-6 bg-gradient-to-br ${motivation.bgColor} border-0 shadow-lg`}>
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${motivation.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{motivation.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{motivation.message}</p>
        </div>

        {!isRestDay && (
          <div className="space-y-3 pt-2">
            <div className="text-sm font-medium text-gray-700">
              {completedExercises} of {totalExercises} exercises completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${motivation.color} rounded-full h-3 transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% completed
            </div>
          </div>
        )}

        {streak > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">{t('exercise.streak') || 'Workout Streak'}</div>
            <div className="text-2xl font-bold text-gray-800">{streak} days 🔥</div>
          </div>
        )}
      </div>
    </Card>
  );
};
