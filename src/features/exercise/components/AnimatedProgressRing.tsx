
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

interface AnimatedProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
}

export const AnimatedProgressRing = ({ 
  completedExercises, 
  totalExercises, 
  progressPercentage, 
  isToday, 
  isRestDay 
}: AnimatedProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const getProgressColor = () => {
    if (isRestDay) return '#10b981'; // green
    if (progressPercentage === 100) return '#10b981'; // green
    if (progressPercentage >= 75) return '#3b82f6'; // blue
    if (progressPercentage >= 50) return '#8b5cf6'; // purple
    return '#f59e0b'; // orange
  };

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={getProgressColor()}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {isRestDay ? (
            <div className="text-green-600 font-bold text-lg">😴</div>
          ) : (
            <>
              <div className="text-lg font-bold text-gray-900">
                {completedExercises}
              </div>
              <div className="text-xs text-gray-500">
                /{totalExercises}
              </div>
            </>
          )}
        </div>
      </div>
      
      {isToday && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};
