
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  completed?: boolean;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive?: boolean;
  onSetActive?: () => void;
}

export const ExerciseCard = ({ exercise, onComplete, onProgressUpdate, isActive, onSetActive }: ExerciseCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{exercise.name}</h3>
        <div className="flex justify-between items-center">
          <div>
            <span>{exercise.sets} sets × {exercise.reps} reps</span>
          </div>
          <Button
            onClick={() => onComplete(exercise.id)}
            variant={exercise.completed ? "secondary" : "default"}
            size="sm"
          >
            {exercise.completed ? "Completed" : "Mark Complete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
