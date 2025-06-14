
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell } from "lucide-react";

export const ExerciseProgress = memo(({ exercises, onViewExercise }: {
  exercises: any[];
  onViewExercise: () => void;
}) => {
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const exerciseProgress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  if (exercises.length === 0) {
    return (
      <div className="text-center py-6">
        <Dumbbell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Rest day or no workout planned</p>
        <Button onClick={onViewExercise} className="mt-3" variant="outline" size="sm">
          View Exercise Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Progress</span>
        <Badge variant={exerciseProgress === 100 ? "default" : "secondary"} className="text-xs">
          {completedExercises}/{exercises.length}
        </Badge>
      </div>
      <Progress value={exerciseProgress} />
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {exercises.slice(0, 3).map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between text-sm">
            <span className={exercise.completed ? "line-through text-gray-500" : ""}>
              {exercise.name}
            </span>
            <span className="text-gray-500 text-xs">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>
        ))}
        {exercises.length > 3 && (
          <p className="text-xs text-gray-500 text-center">
            +{exercises.length - 3} more exercises
          </p>
        )}
      </div>
    </div>
  );
});

ExerciseProgress.displayName = 'ExerciseProgress';
