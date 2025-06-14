
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Trophy, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface ExerciseProgressTrackerProps {
  currentProgram: any;
  selectedDay: number;
  currentWeekOffset: number;
  completedExercises: number;
  totalExercises: number;
}

export const ExerciseProgressTracker = ({
  currentProgram,
  selectedDay,
  currentWeekOffset,
  completedExercises,
  totalExercises
}: ExerciseProgressTrackerProps) => {
  const { t } = useLanguage();
  
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayName = dayNames[selectedDay - 1];

  return (
    <Card className="p-3 bg-gradient-to-br from-health-primary/5 to-health-secondary/5 border border-health-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Day Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-health-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-health-text-primary">{currentDayName}</div>
            <div className="text-xs text-health-text-secondary">
              {currentProgram?.workout_type === "gym" ? "Gym" : "Home"}
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-health-text-primary">
              {completedExercises}/{totalExercises}
            </div>
            <div className="text-xs text-health-text-secondary">Exercises</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-health-text-secondary">Progress</span>
              <span className="text-xs font-medium text-health-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-end">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              progressPercentage === 100 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : progressPercentage > 0 
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            {progressPercentage === 100 ? '✅ Complete' : 
             progressPercentage > 0 ? '🔥 In Progress' : '🎯 Ready'}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
