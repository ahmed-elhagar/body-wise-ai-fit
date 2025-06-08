
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnimatedProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AnimatedProgressRing = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay,
  size = 'md',
  showDetails = true
}: AnimatedProgressRingProps) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: { ring: 'w-16 h-16', text: 'text-xs', card: 'p-3' },
    md: { ring: 'w-24 h-24', text: 'text-sm', card: 'p-4' },
    lg: { ring: 'w-32 h-32', text: 'text-lg', card: 'p-6' }
  };

  const { ring, text, card } = sizeClasses[size];

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const getStatusColor = () => {
    if (isRestDay) return 'text-blue-600';
    if (progressPercentage === 100) return 'text-green-600';
    if (progressPercentage >= 75) return 'text-purple-600';
    if (progressPercentage >= 50) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (isRestDay) return <Calendar className="w-4 h-4" />;
    if (progressPercentage === 100) return <Trophy className="w-4 h-4" />;
    if (progressPercentage >= 50) return <Flame className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getMotivationMessage = () => {
    if (isRestDay) return t('Rest & Recover');
    if (progressPercentage === 100) return t('Workout Complete! 🎉');
    if (progressPercentage >= 75) return t('Almost there! 💪');
    if (progressPercentage >= 50) return t('Halfway done! 🔥');
    if (progressPercentage > 0) return t('Great start! ⚡');
    return t('Ready to begin! 🚀');
  };

  return (
    <Card className={`${card} bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Animated Progress Ring */}
        <div className="relative">
          <svg className={`${ring} transform -rotate-90`} viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-out ${
                isRestDay 
                  ? 'text-blue-500' 
                  : progressPercentage === 100 
                  ? 'text-green-500'
                  : progressPercentage >= 75
                  ? 'text-purple-500'
                  : progressPercentage >= 50
                  ? 'text-orange-500'
                  : 'text-blue-500'
              }`}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-bold ${text} ${getStatusColor()}`}>
              {isRestDay ? '😴' : `${Math.round(progressPercentage)}%`}
            </span>
            {size !== 'sm' && (
              <span className="text-xs text-gray-500 mt-1">
                {isRestDay ? 'Rest' : `${completedExercises}/${totalExercises}`}
              </span>
            )}
          </div>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {getStatusIcon()}
              <span className={`font-semibold ${getStatusColor()}`}>
                {isToday ? t('Today') : t('Workout')}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 max-w-32 leading-relaxed">
              {getMotivationMessage()}
            </p>

            {!isRestDay && (
              <div className="flex justify-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    progressPercentage === 100 
                      ? 'border-green-300 text-green-700 bg-green-50' 
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {completedExercises} / {totalExercises} done
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AnimatedProgressRing;
