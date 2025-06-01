
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay?: boolean;
}

const ProgressRing = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay = false
}: ProgressRingProps) => {
  const { t } = useLanguage();

  const getProgressColor = () => {
    if (progressPercentage === 100) return "text-success-500";
    if (progressPercentage >= 75) return "text-fitness-secondary-500";
    if (progressPercentage >= 50) return "text-fitness-orange-500";
    if (progressPercentage >= 25) return "text-fitness-accent-500";
    return "text-fitness-primary-500";
  };

  const getProgressMessage = () => {
    if (isRestDay) return t('exercise.restDay');
    if (progressPercentage === 100) return t('exercise.completed');
    if (progressPercentage >= 75) return t('exercise.almostDone');
    if (progressPercentage >= 50) return t('exercise.halfwayThere');
    if (progressPercentage > 0) return t('exercise.goodStart');
    return t('exercise.letsStart');
  };

  if (isRestDay) {
    return (
      <div className="text-center space-y-4">
        {/* Rest Day Icon */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-fitness-orange-100 to-fitness-orange-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">😴</span>
          </div>
        </div>

        {/* Rest Day Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-fitness-orange-800">
            {t('exercise.restDay')}
          </h3>
          <p className="text-sm text-fitness-orange-600">
            {t('exercise.restDayMessage')}
          </p>
        </div>

        {/* Rest Day Badge */}
        <Badge 
          variant="outline" 
          className="bg-fitness-orange-50 border-fitness-orange-200 text-fitness-orange-700 font-medium"
        >
          <Calendar className="w-3 h-3 mr-1" />
          {isToday ? t('exercise.today') : t('exercise.restDay')}
        </Badge>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {/* Enhanced Progress Ring */}
      <div className="relative w-24 h-24 mx-auto">
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200 stroke-current"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress Circle with enhanced colors */}
          <path
            className={`${getProgressColor()} stroke-current transition-all duration-1000 ease-out`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${progressPercentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progressPercentage === 100 ? (
            <CheckCircle className="w-8 h-8 text-success-500" />
          ) : (
            <span className={`text-xl font-bold ${getProgressColor()}`}>
              {Math.round(progressPercentage)}%
            </span>
          )}
        </div>
      </div>

      {/* Enhanced Progress Details */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {getProgressMessage()}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`font-bold ${getProgressColor()}`}>
              {completedExercises}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">
              {totalExercises}
            </span>
            <span className="text-gray-500 text-sm ml-1">
              {t('exercise.exercises')}
            </span>
          </div>
        </div>

        {/* Enhanced Status Badge */}
        <Badge 
          variant="outline" 
          className={`${
            isToday 
              ? "bg-fitness-primary-50 border-fitness-primary-200 text-fitness-primary-700" 
              : "bg-gray-50 border-gray-200 text-gray-600"
          } font-medium`}
        >
          {isToday ? (
            <>
              <Target className="w-3 h-3 mr-1" />
              {t('exercise.today')}
            </>
          ) : (
            <>
              <Calendar className="w-3 h-3 mr-1" />
              {t('exercise.planned')}
            </>
          )}
        </Badge>

        {/* Progress Achievement */}
        {progressPercentage > 0 && (
          <div className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
            progressPercentage === 100 
              ? "bg-success-50 text-success-700 border border-success-200" 
              : "bg-fitness-primary-50 text-fitness-primary-700 border border-fitness-primary-200"
          }`}>
            {progressPercentage === 100 ? (
              <>
                <Trophy className="w-3 h-3 inline mr-1" />
                {t('exercise.workoutComplete')}
              </>
            ) : (
              `${t('exercise.progress')}: ${Math.round(progressPercentage)}%`
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
