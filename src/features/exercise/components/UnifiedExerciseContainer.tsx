
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { RestDayCard } from "./RestDayCard";
import { AnimatedProgressRing } from "./AnimatedProgressRing";
import { Target, Trophy, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UnifiedExerciseContainerProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay: boolean;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  currentProgram?: any;
  selectedDayNumber: number;
}

export const UnifiedExerciseContainer = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay,
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  currentProgram,
  selectedDayNumber
}: UnifiedExerciseContainerProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading exercises...</span>
        </div>
      </Card>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Exercises Today</h3>
        <p className="text-gray-500">
          No exercises scheduled for this day. Check back later or generate a new program.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Progress Section */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <AnimatedProgressRing
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              size={60}
              strokeWidth={6}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Day {selectedDayNumber} Progress
            </h3>
            <p className="text-gray-600 text-sm">
              {completedExercises} of {totalExercises} exercises completed
            </p>
            <div className="flex items-center gap-2 mt-2">
              {isToday && (
                <Badge className="bg-green-500 text-white text-xs">Today</Badge>
              )}
              <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                {totalExercises} exercises
              </Badge>
              {progressPercentage === 100 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold text-xs">Complete!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Exercises List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
          />
        ))}
      </div>

      {/* Motivation Card */}
      {progressPercentage > 0 && progressPercentage < 100 && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-orange-800 text-sm">Keep Going!</h4>
              <p className="text-orange-600 text-xs">
                You're {Math.round(progressPercentage)}% done with today's workout. You've got this!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
