
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import OptimizedExerciseList from './OptimizedExerciseList';
import { DailyWorkout, Exercise } from '@/types/exercise';

interface OptimizedExerciseContainerProps {
  dailyWorkout: DailyWorkout | null;
  selectedDay: number;
  onExerciseStart: (exerciseId: string) => void;
  onExerciseComplete: (exerciseId: string) => void;
  workoutType: 'home' | 'gym';
}

const OptimizedExerciseContainer = ({
  dailyWorkout,
  selectedDay,
  onExerciseStart,
  onExerciseComplete,
  workoutType
}: OptimizedExerciseContainerProps) => {
  const { t, isRTL } = useI18n();

  // Handle rest day
  if (!dailyWorkout || dailyWorkout.is_rest_day) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {t('exercise:restDay') || 'Rest Day'}
            </h3>
            <p className="text-green-700 mb-4">
              {t('exercise:restDayDescription') || 'Take this day to recover and let your muscles rebuild stronger.'}
            </p>
            <div className="flex justify-center gap-4 text-sm text-green-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{t('exercise:recovery') || 'Recovery'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t('exercise:lightActivity') || 'Light activity only'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Create a mock daily workout if data is incomplete
  const workoutData = dailyWorkout.exercises && dailyWorkout.exercises.length > 0
    ? dailyWorkout
    : {
        ...dailyWorkout,
        id: `mock-${selectedDay}`,
        weekly_program_id: '',
        day_number: selectedDay,
        completed: false,
        exercises: [] as Exercise[]
      };

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {workoutData.workout_name || `Day ${selectedDay} Workout`}
              </h2>
              <p className="text-gray-600">
                {workoutType === 'home' ? t('exercise:homeWorkout') : t('exercise:gymWorkout')} • 
                {workoutData.estimated_duration || 45} {t('exercise:minutes')}
              </p>
            </div>
          </div>
          
          <div className={`flex flex-col gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {workoutData.estimated_duration || 45} min
            </Badge>
            {workoutData.muscle_groups && workoutData.muscle_groups.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {workoutData.muscle_groups.join(', ')}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Exercise List */}
      <OptimizedExerciseList
        exercises={workoutData.exercises || []}
        currentExerciseIndex={0}
        workoutType={workoutType}
        onExerciseStart={onExerciseStart}
        onExerciseComplete={onExerciseComplete}
      />
    </div>
  );
};

export default OptimizedExerciseContainer;
