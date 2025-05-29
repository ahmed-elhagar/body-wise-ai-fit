
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap, Star, Heart, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseMotivationCardProps {
  completedExercises: number;
  totalExercises: number;
  isRestDay?: boolean;
}

export const ExerciseMotivationCard = ({
  completedExercises,
  totalExercises,
  isRestDay = false
}: ExerciseMotivationCardProps) => {
  const { t } = useLanguage();

  const getMotivationalContent = () => {
    if (isRestDay) {
      return {
        icon: Coffee,
        title: t('exercise.restDay'),
        message: t('exercise.motivation.restWell'),
        color: 'from-orange-400 to-yellow-400',
        bgColor: 'from-orange-50 to-yellow-50',
        badge: t('exercise.rest'),
        badgeColor: 'bg-orange-100 text-orange-700'
      };
    }

    if (totalExercises === 0) {
      return {
        icon: Target,
        title: t('exercise.startWorkout'),
        message: t('exercise.motivation.getStarted'),
        color: 'from-blue-400 to-indigo-400',
        bgColor: 'from-blue-50 to-indigo-50',
        badge: t('exercise.ready') || 'Ready',
        badgeColor: 'bg-blue-100 text-blue-700'
      };
    }

    const progressPercentage = (completedExercises / totalExercises) * 100;

    if (progressPercentage === 100) {
      return {
        icon: Trophy,
        title: t('exercise.workoutComplete'),
        message: t('exercise.motivation.perfect'),
        color: 'from-yellow-400 to-orange-400',
        bgColor: 'from-yellow-50 to-orange-50',
        badge: t('exercise.completed'),
        badgeColor: 'bg-green-100 text-green-700'
      };
    } else if (progressPercentage >= 80) {
      return {
        icon: Star,
        title: t('exercise.almostThere') || 'Almost There!',
        message: t('exercise.motivation.outstanding'),
        color: 'from-purple-400 to-pink-400',
        bgColor: 'from-purple-50 to-pink-50',
        badge: `${Math.round(progressPercentage)}%`,
        badgeColor: 'bg-purple-100 text-purple-700'
      };
    } else if (progressPercentage >= 60) {
      return {
        icon: Zap,
        title: t('exercise.greatProgress') || 'Great Progress!',
        message: t('exercise.motivation.incredible'),
        color: 'from-green-400 to-teal-400',
        bgColor: 'from-green-50 to-teal-50',
        badge: `${Math.round(progressPercentage)}%`,
        badgeColor: 'bg-green-100 text-green-700'
      };
    } else if (progressPercentage >= 40) {
      return {
        icon: Target,
        title: t('exercise.keepGoing') || 'Keep Going!',
        message: t('exercise.motivation.fantastic'),
        color: 'from-blue-400 to-cyan-400',
        bgColor: 'from-blue-50 to-cyan-50',
        badge: `${Math.round(progressPercentage)}%`,
        badgeColor: 'bg-blue-100 text-blue-700'
      };
    } else if (progressPercentage > 0) {
      return {
        icon: Heart,
        title: t('exercise.goodStart') || 'Good Start!',
        message: t('exercise.motivation.awesome'),
        color: 'from-pink-400 to-rose-400',
        bgColor: 'from-pink-50 to-rose-50',
        badge: `${Math.round(progressPercentage)}%`,
        badgeColor: 'bg-pink-100 text-pink-700'
      };
    } else {
      return {
        icon: Target,
        title: t('exercise.letsStart') || "Let's Start!",
        message: t('exercise.motivation.great'),
        color: 'from-indigo-400 to-blue-400',
        bgColor: 'from-indigo-50 to-blue-50',
        badge: '0%',
        badgeColor: 'bg-gray-100 text-gray-700'
      };
    }
  };

  const content = getMotivationalContent();
  const IconComponent = content.icon;

  return (
    <Card className={`p-4 bg-gradient-to-br ${content.bgColor} border-0 shadow-sm`}>
      <div className="text-center space-y-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs ${content.badgeColor}`}>
            {content.badge}
          </Badge>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${content.color} flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {content.title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {content.message}
          </p>
        </div>

        {!isRestDay && totalExercises > 0 && (
          <div className="pt-2 border-t border-gray-200/50">
            <div className="text-xs text-gray-500">
              {completedExercises}/{totalExercises} {t('exercise.exercises')}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
