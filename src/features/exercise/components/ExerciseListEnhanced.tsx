
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Dumbbell, Play, AlertCircle } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseListEnhancedProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
  currentProgram?: any;
  selectedDayNumber: number;
}

export const ExerciseListEnhanced = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay,
  currentProgram,
  selectedDayNumber
}: ExerciseListEnhancedProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isRestDay) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Rest Day</h3>
          <p className="text-gray-600 max-w-md">
            Today is your rest day. Take time to recover and prepare for tomorrow's workout.
          </p>
        </div>
      </Card>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exercises Today</h3>
          <p className="text-gray-600">No exercises scheduled for today.</p>
        </div>
      </Card>
    );
  }

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedCount / exercises.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <Card className="p-4 bg-gradient-to-r from-fitness-primary-50 to-fitness-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-fitness-primary-800">Today's Progress</h3>
            <p className="text-sm text-fitness-primary-600">
              {completedCount} of {exercises.length} exercises completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-fitness-primary-700">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Exercise List */}
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className={`p-6 transition-all ${
          exercise.completed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-white border-gray-200 hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                exercise.completed ? 'bg-green-500' : 'bg-fitness-primary-500'
              }`}>
                {exercise.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{exercise.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {exercise.sets && (
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-4 h-4" />
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                  )}
                  {exercise.rest_seconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.rest_seconds}s rest
                    </span>
                  )}
                </div>
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {exercise.muscle_groups.map((muscle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {exercise.completed ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Button
                  onClick={() => onExerciseComplete(exercise.id)}
                  className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </div>

          {exercise.instructions && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{exercise.instructions}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
