
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dumbbell, Clock, Target } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_groups: string[];
  instructions: string;
  equipment?: string;
  difficulty?: string;
  completed: boolean;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onToggleComplete: (exerciseId: string) => void;
}

export const ExerciseCard = ({ exercise, onToggleComplete }: ExerciseCardProps) => {
  return (
    <Card className={exercise.completed ? 'opacity-75' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {exercise.name}
          </CardTitle>
          <Badge variant={exercise.completed ? 'default' : 'outline'}>
            {exercise.completed ? 'Completed' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {exercise.sets} sets × {exercise.reps} reps
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {exercise.rest_seconds}s rest
            </div>
          </div>

          {exercise.muscle_groups.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {exercise.muscle_groups.map((muscle) => (
                <Badge key={muscle} variant="secondary" className="text-xs">
                  {muscle}
                </Badge>
              ))}
            </div>
          )}

          {exercise.instructions && (
            <p className="text-sm text-gray-600">{exercise.instructions}</p>
          )}

          <div className="flex gap-2">
            {exercise.equipment && (
              <Badge variant="outline">{exercise.equipment}</Badge>
            )}
            {exercise.difficulty && (
              <Badge variant="outline">{exercise.difficulty}</Badge>
            )}
          </div>

          <Button
            onClick={() => onToggleComplete(exercise.id)}
            variant={exercise.completed ? 'outline' : 'default'}
            className="w-full"
          >
            {exercise.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
