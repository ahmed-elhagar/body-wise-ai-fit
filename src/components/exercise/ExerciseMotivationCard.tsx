
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Target, Star } from "lucide-react";
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
        title: t('exercise.restDayMotivation') || "Recovery Time!",
        message: t('exercise.restDayMotivationMsg') || "Your muscles are rebuilding stronger. Great job taking care of yourself!",
        color: "from-orange-400 to-yellow-400"
      };
    }

    if (progressPercentage === 100) {
      return {
        icon: Trophy,
        title: t('exercise.workoutComplete') || "Workout Complete!",
        message: t('exercise.workoutCompleteMsg') || "Amazing work! You've crushed today's workout. You're getting stronger every day!",
        color: "from-green-400 to-emerald-400"
      };
    }

    if (progressPercentage >= 75) {
      return {
        icon: Zap,
        title: t('exercise.almostThere') || "Almost There!",
        message: t('exercise.almostThereMsg') || "You're so close to finishing! Push through these last few exercises!",
        color: "from-blue-400 to-indigo-400"
      };
    }

    if (progressPercentage >= 50) {
      return {
        icon: Target,
        title: t('exercise.halfwayThere') || "Halfway There!",
        message: t('exercise.halfwayThereMsg') || "Great momentum! You're doing fantastic. Keep up the excellent work!",
        color: "from-purple-400 to-pink-400"
      };
    }

    return {
      icon: Zap,
      title: t('exercise.letsGo') || "Let's Go!",
      message: t('exercise.letsGoMsg') || "Ready to crush this workout? Every rep counts towards your fitness goals!",
      color: "from-indigo-400 to-purple-400"
    };
  };

  const motivation = getMotivationMessage();
  const IconComponent = motivation.icon;

  return (
    <Card className={`p-6 bg-gradient-to-br ${motivation.color} text-white shadow-lg`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">{motivation.title}</h3>
          <p className="text-white/90 text-sm">{motivation.message}</p>
        </div>

        {!isRestDay && (
          <div className="space-y-2">
            <div className="text-sm text-white/90">
              {completedExercises} of {totalExercises} exercises completed
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {streak > 0 && (
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm text-white/90 mb-1">{t('exercise.streak')}</div>
            <div className="text-2xl font-bold">{streak} days</div>
          </div>
        )}
      </div>
    </Card>
  );
};
