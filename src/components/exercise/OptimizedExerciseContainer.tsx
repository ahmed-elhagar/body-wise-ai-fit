
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import OptimizedExerciseDayView from './OptimizedExerciseDayView';

interface OptimizedExerciseContainerProps {
  exercises: any[];
  selectedDay: number;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
  isLoading: boolean;
}

const OptimizedExerciseContainer = ({
  exercises,
  selectedDay,
  onStartWorkout,
  onCompleteWorkout,
  isLoading
}: OptimizedExerciseContainerProps) => {
  const { t, isRTL } = useI18n();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const dailyWorkout = {
    workout_name: `Day ${selectedDay} Workout`,
    estimated_duration: 45,
    muscle_groups: ['Full Body'],
    is_rest_day: exercises.length === 0
  };

  const handleExerciseComplete = (exerciseId: string) => {
    console.log('Exercise completed:', exerciseId);
  };

  const handleExerciseStart = (exerciseId: string) => {
    console.log('Exercise started:', exerciseId);
    setIsWorkoutActive(true);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="w-8 h-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">{t('exercise:loading') || 'Loading workout...'}</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Workout Controls */}
      <Card className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h3 className="font-semibold text-lg">{dailyWorkout.workout_name}</h3>
            <p className="text-sm text-gray-600">
              {exercises.length} {t('exercise:exercises') || 'exercises'} • {dailyWorkout.estimated_duration} {t('exercise:minutes') || 'min'}
            </p>
          </div>
          
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!isWorkoutActive ? (
              <Button onClick={onStartWorkout} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                {t('exercise:startWorkout') || 'Start Workout'}
              </Button>
            ) : (
              <>
                <Button variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  {t('exercise:pause') || 'Pause'}
                </Button>
                <Button variant="outline">
                  <SkipForward className="w-4 h-4 mr-2" />
                  {t('exercise:skip') || 'Skip'}
                </Button>
                <Button onClick={onCompleteWorkout} className="bg-red-600 hover:bg-red-700">
                  {t('exercise:finish') || 'Finish'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Exercise Day View */}
      <OptimizedExerciseDayView
        dailyWorkout={dailyWorkout}
        exercises={exercises}
        selectedDay={selectedDay}
        onExerciseComplete={handleExerciseComplete}
        onExerciseStart={handleExerciseStart}
      />
    </div>
  );
};

export default OptimizedExerciseContainer;
