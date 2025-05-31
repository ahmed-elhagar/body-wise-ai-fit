
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-800">
            <Trophy className="w-4 h-4 text-green-500" />
            Rest Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">
              Enjoy your rest day! Recovery is important for progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalExercises === 0) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-800">
            <Target className="w-4 h-4 text-gray-400" />
            No Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              No exercises scheduled for this day.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = progressPercentage === 100;

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-800">
          <Target className="w-4 h-4 text-blue-500" />
          {isToday ? "Today's Progress" : "Daily Progress"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Circle */}
          <div className="relative w-16 h-16 mx-auto">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke={isCompleted ? "#10b981" : "#3b82f6"}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-800">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center space-y-2">
            <div className="text-base font-medium text-gray-800">
              {completedExercises} / {totalExercises} exercises
            </div>
            
            {isCompleted && (
              <Badge variant="success" className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Workout Complete!
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
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
