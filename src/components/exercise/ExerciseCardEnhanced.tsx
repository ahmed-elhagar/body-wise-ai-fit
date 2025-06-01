import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, RotateCcw, CheckCircle, Play, Pause } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { ExerciseProgressDialog } from './ExerciseProgressDialog';

interface ExerciseCardEnhancedProps {
  exercise: any;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const ExerciseCardEnhanced = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExerciseCardEnhancedProps) => {
  const { t } = useI18n();
  const [isCompleted, setIsCompleted] = useState(exercise.completed || false);
  const [isTrackingProgress, setIsTrackingProgress] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const toggleComplete = () => {
    setIsCompleted(!isCompleted);
    onExerciseComplete(exercise.id);
  };

  const handleProgressUpdate = (sets: number, reps: string, notes?: string) => {
    onExerciseProgressUpdate(exercise.id, sets, reps, notes);
    setIsTrackingProgress(false);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <>
      <Card
        className={`p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isCompleted ? 'bg-green-50/80' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : exercise.order_number || index + 1}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {exercise.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span>{exercise.sets} sets × {exercise.reps} reps</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.rest_seconds}s rest
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {exercise.equipment || 'Bodyweight'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {exercise.difficulty || 'Beginner'}
                </Badge>
              </div>
              {exercise.instructions && (
                <p className="text-sm text-gray-600 mt-2">{exercise.instructions}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/80"
              onClick={() => setIsTrackingProgress(true)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Track
            </Button>
            {!isCompleted && (
              <Button
                size="sm"
                className="bg-fitness-gradient hover:opacity-90 text-white"
                onClick={toggleComplete}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ExerciseProgressDialog
        open={isTrackingProgress}
        onOpenChange={setIsTrackingProgress}
        exercise={exercise}
        onSave={handleProgressUpdate}
      />
    </>
  );
};
