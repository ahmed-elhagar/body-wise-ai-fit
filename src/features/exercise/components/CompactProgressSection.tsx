
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Trophy, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CompactProgressSectionProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
}

export const CompactProgressSection = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber
}: CompactProgressSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDay = dayNames[selectedDayNumber - 1];

  if (isRestDay) {
    return (
      <Card className="p-3 bg-orange-50 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900">Rest Day</h3>
            <p className="text-sm text-orange-700">Take a well-deserved break today!</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <div className="p-3">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              progressPercentage === 100 
                ? 'bg-green-500' 
                : progressPercentage > 0 
                ? 'bg-blue-500' 
                : 'bg-gray-400'
            }`}>
              {progressPercentage === 100 ? (
                <Trophy className="w-4 h-4 text-white" />
              ) : (
                <Target className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-sm">{currentDay}'s Progress</h3>
              <p className="text-xs text-gray-600">
                {completedExercises}/{totalExercises} exercises completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{Math.round(progressPercentage)}%</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </Button>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-500">Overall Progress</span>
                <span className="font-semibold text-gray-700">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{completedExercises}</div>
                <div className="text-xs text-blue-700">Completed</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-gray-600">{totalExercises - completedExercises}</div>
                <div className="text-xs text-gray-700">Remaining</div>
              </div>
            </div>

            {progressPercentage === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-semibold text-green-800">Workout Complete!</p>
                <p className="text-xs text-green-700">Great job finishing today's session</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
