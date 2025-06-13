
import { Exercise } from '../types';
import { InteractiveExerciseCard } from './InteractiveExerciseCard';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, Target, Award } from "lucide-react";

interface ExerciseSessionViewProps {
  exercises: Exercise[];
  activeExerciseId: string | null;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onSessionComplete: () => void;
  onSetActive: (exerciseId: string) => void;
  onDeactivate: () => void;
}

export const ExerciseSessionView = ({
  exercises,
  activeExerciseId,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onSessionComplete,
  onSetActive,
  onDeactivate
}: ExerciseSessionViewProps) => {
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const progressPercentage = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;
  const estimatedTime = exercises.length * 3;

  return (
    <div className="space-y-4">
      {/* Session Progress Overview */}
      <Card className="p-4 bg-gradient-to-r from-fitness-primary-50 to-fitness-secondary-50 border-fitness-primary-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-fitness-primary-800">Workout Session</h3>
          <Badge variant="secondary" className="bg-fitness-primary-100 text-fitness-primary-700">
            {completedExercises}/{exercises.length} Complete
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-3" />
        
        <div className="flex items-center gap-6 text-sm text-fitness-primary-600">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span>~{estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{exercises.length} exercises</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>{Math.round(progressPercentage)}% done</span>
          </div>
        </div>
      </Card>

      {/* Exercise Cards */}
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
    </div>
  );
};
