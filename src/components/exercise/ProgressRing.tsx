
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressRingProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
}

const ProgressRing = ({ 
  completedExercises, 
  totalExercises, 
  progressPercentage, 
  isToday,
  isRestDay 
}: ProgressRingProps) => {
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Rest Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm opacity-90">
              Enjoy your rest day! Recovery is important for progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalExercises === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            No Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm opacity-90">
              No exercises scheduled for this day.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = progressPercentage === 100;

  return (
    <Card className={`border-0 shadow-lg ${
      isCompleted 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
        : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          {isToday ? "Today's Progress" : "Daily Progress"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Circle */}
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="opacity-20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold">
              {completedExercises} / {totalExercises} {t('exercise:exercises')}
            </div>
            
            {isCompleted && (
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <CheckCircle className="w-4 h-4" />
                Workout Complete!
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-white/20"
            />
            <div className="flex justify-between text-xs opacity-75">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressRing;
