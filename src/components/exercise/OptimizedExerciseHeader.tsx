
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, Target, Zap } from "lucide-react";

interface OptimizedExerciseHeaderProps {
  program: any;
  progressMetrics: {
    completedWorkouts: number;
    totalWorkouts: number;
    progressPercentage: number;
  };
  onGenerateNew: () => void;
}

const OptimizedExerciseHeader = React.memo<OptimizedExerciseHeaderProps>(({ 
  program, 
  progressMetrics, 
  onGenerateNew 
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {program.program_name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Week {program.current_week}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{program.difficulty_level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>{program.workout_type}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {progressMetrics.progressPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {progressMetrics.completedWorkouts}/{progressMetrics.totalWorkouts} completed
            </div>
          </div>
          
          <Badge 
            variant={progressMetrics.progressPercentage > 70 ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {progressMetrics.progressPercentage > 70 ? "On Track" : "Keep Going"}
          </Badge>
          
          <Button 
            onClick={onGenerateNew}
            variant="outline"
            size="sm"
          >
            Generate New Program
          </Button>
        </div>
      </div>
    </Card>
  );
});

OptimizedExerciseHeader.displayName = 'OptimizedExerciseHeader';

export default OptimizedExerciseHeader;
