
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Calendar, Trophy } from "lucide-react";

interface AnimatedProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay?: boolean;
}

export const AnimatedProgressRing = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay = false
}: AnimatedProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const getProgressColor = () => {
    if (isRestDay) return "#6B7280"; // gray
    if (progressPercentage === 100) return "#10B981"; // green
    if (progressPercentage > 50) return "#3B82F6"; // blue
    return "#F59E0B"; // amber
  };

  const getIcon = () => {
    if (isRestDay) return <Calendar className="w-8 h-8 text-gray-600" />;
    if (progressPercentage === 100) return <Trophy className="w-8 h-8 text-green-600" />;
    if (progressPercentage > 0) return <CheckCircle className="w-8 h-8 text-blue-600" />;
    return <Clock className="w-8 h-8 text-amber-600" />;
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Background Circle */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute transform -rotate-90"
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle */}
        <circle
          stroke={getProgressColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center">
        {getIcon()}
        <div className="text-center mt-1">
          <div className="text-sm font-bold text-gray-900">
            {isRestDay ? 'Rest' : `${completedExercises}/${totalExercises}`}
          </div>
          <div className="text-xs text-gray-600">
            {isRestDay ? 'Day' : isToday ? 'Today' : 'Exercises'}
          </div>
        </div>
      </div>

      {/* Progress Percentage */}
      {!isRestDay && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
            progressPercentage === 100 
              ? 'bg-green-100 text-green-700' 
              : progressPercentage > 50 
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {Math.round(progressPercentage)}%
          </div>
        </div>
      )}
    </div>
  );
};
