
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OptimizedExerciseDayViewProps {
  currentWorkout: any;
  exercises: any[];
  selectedDay: number;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
  isLoading: boolean;
}

const OptimizedExerciseDayView = ({ 
  currentWorkout, 
  exercises, 
  selectedDay, 
  onStartWorkout, 
  onCompleteWorkout, 
  isLoading 
}: OptimizedExerciseDayViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day {selectedDay} Workout</CardTitle>
      </CardHeader>
      <CardContent>
        {exercises.length > 0 ? (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="p-3 border rounded">
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-gray-600">
                  {exercise.sets} sets × {exercise.reps} reps
                </p>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={onStartWorkout} disabled={isLoading}>
                Start Workout
              </Button>
              <Button onClick={onCompleteWorkout} variant="outline" disabled={isLoading}>
                Mark Complete
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No exercises for this day</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedExerciseDayView;
