
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calendar } from "lucide-react";

interface ProgressMetrics {
  completedWorkouts: number;
  totalWorkouts: number;
  progressPercentage: number;
}

interface WeekDay {
  dayNumber: number;
  dayName: string;
  isCompleted: boolean;
  isRestDay: boolean;
  isToday: boolean;
}

interface OptimizedExerciseProgressProps {
  progressMetrics: ProgressMetrics;
  weekStructure: WeekDay[];
}

const OptimizedExerciseProgress = React.memo<OptimizedExerciseProgressProps>(({ 
  progressMetrics, 
  weekStructure 
}) => {
  const { completedWorkouts, totalWorkouts, progressPercentage } = progressMetrics;
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Weekly Progress
        </h3>
        
        <Badge 
          variant={progressPercentage >= 70 ? "default" : "secondary"}
          className="px-3 py-1"
        >
          {progressPercentage >= 70 ? "Excellent" : progressPercentage >= 40 ? "Good" : "Keep Going"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Target className="w-4 h-4" />
            Overall Progress
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedWorkouts} of {totalWorkouts} workouts</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Calendar className="w-4 h-4" />
            This Week
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekStructure.map((day) => (
              <div 
                key={day.dayNumber}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${day.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : day.isRestDay 
                    ? 'bg-orange-100 text-orange-600'
                    : day.isToday
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {day.dayName[0]}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600">Quick Stats</div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedWorkouts}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {totalWorkouts - completedWorkouts}
              </div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

OptimizedExerciseProgress.displayName = 'OptimizedExerciseProgress';

export default OptimizedExerciseProgress;
