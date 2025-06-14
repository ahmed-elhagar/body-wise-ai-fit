
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
}

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onDeactivate: () => void;
}

export const ActiveExerciseTracker = ({ exercise, onComplete, onProgressUpdate, onDeactivate }: ActiveExerciseTrackerProps) => {
  return (
    <Card className="border-blue-500">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {exercise.name}
          <Button variant="outline" size="sm" onClick={onDeactivate}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Active exercise tracking for {exercise.name}</p>
        <Button onClick={() => onComplete(exercise.id)} className="mt-2">
          Complete Exercise
        </Button>
      </CardContent>
    </Card>
  );
};
