
import React from 'react';
import { Progress } from "@/components/ui/progress";

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
  if (isRestDay) {
    return (
      <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full">
        <div className="text-center">
          <div className="text-blue-600 font-bold text-xs">REST</div>
          <div className="text-blue-500 text-xs">DAY</div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 30;
  const strokeDasharray = `${(progressPercentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 68 68">
        <circle
          cx="34"
          cy="34"
          r="30"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="34"
          cy="34"
          r="30"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          className={`transition-all duration-500 ${
            progressPercentage === 100 
              ? 'text-green-500' 
              : progressPercentage > 75 
              ? 'text-blue-500'
              : progressPercentage > 50 
              ? 'text-purple-500'
              : 'text-orange-500'
          }`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{completedExercises}</div>
          <div className="text-xs text-gray-600">/{totalExercises}</div>
        </div>
      </div>
    </div>
  );
};
