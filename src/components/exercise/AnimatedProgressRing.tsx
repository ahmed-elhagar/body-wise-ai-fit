
import { useEffect, useState } from "react";
import { Trophy, Target, Flame } from "lucide-react";

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
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const getMotivationMessage = () => {
    if (isRestDay) return { message: "Recovery Day", emoji: "😌", color: "text-orange-600" };
    if (progressPercentage === 100) return { message: "Completed!", emoji: "🎉", color: "text-green-600" };
    if (progressPercentage >= 75) return { message: "Almost There!", emoji: "💪", color: "text-blue-600" };
    if (progressPercentage >= 50) return { message: "Halfway Done!", emoji: "🔥", color: "text-purple-600" };
    if (progressPercentage > 0) return { message: "Keep Going!", emoji: "⚡", color: "text-indigo-600" };
    return { message: "Let's Start!", emoji: "🚀", color: "text-gray-600" };
  };

  const motivation = getMotivationMessage();

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Background Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={
              progressPercentage === 100 ? "text-green-500" :
              progressPercentage >= 75 ? "text-blue-500" :
              progressPercentage >= 50 ? "text-purple-500" :
              progressPercentage > 0 ? "text-indigo-500" : "text-gray-400"
            } stopColor="currentColor" />
            <stop offset="100%" className={
              progressPercentage === 100 ? "text-emerald-500" :
              progressPercentage >= 75 ? "text-indigo-500" :
              progressPercentage >= 50 ? "text-pink-500" :
              progressPercentage > 0 ? "text-purple-500" : "text-gray-500"
            } stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {/* Progress Percentage */}
        <div className="text-3xl font-bold text-gray-900 mb-1 font-mono">
          {Math.round(animatedProgress)}%
        </div>
        
        {/* Exercise Count */}
        <div className="text-sm text-gray-600 mb-2">
          {completedExercises} / {totalExercises}
        </div>
        
        {/* Motivation */}
        <div className={`text-xs font-semibold ${motivation.color} flex items-center gap-1`}>
          <span>{motivation.emoji}</span>
          <span>{motivation.message}</span>
        </div>
      </div>
      
      {/* Floating Achievement Icons */}
      {progressPercentage === 100 && (
        <div className="absolute inset-0 pointer-events-none">
          <Trophy className="absolute top-0 right-0 w-6 h-6 text-yellow-500 animate-bounce" />
          <Target className="absolute bottom-0 left-0 w-5 h-5 text-green-500 animate-pulse" />
          <Flame className="absolute top-2 left-2 w-5 h-5 text-orange-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};
