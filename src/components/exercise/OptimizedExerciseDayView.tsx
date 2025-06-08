
import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise, DailyWorkout } from '@/types/exercise';
import { RestDayCard } from './RestDayCard';
import InteractiveExerciseCard from './InteractiveExerciseCard';

interface OptimizedExerciseDayViewProps {
  dailyWorkout: DailyWorkout;
  exercises: Exercise[];
  selectedDay: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseStart: (exerciseId: string) => void;
}

const OptimizedExerciseDayView = memo(({
  dailyWorkout,
  exercises,
  selectedDay,
  onExerciseComplete,
  onExerciseStart
}: OptimizedExerciseDayViewProps) => {
  const { t, isRTL } = useI18n();

  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => (a.order_number || 0) - (b.order_number || 0));
  }, [exercises]);

  const workoutStats = useMemo(() => {
    const completed = exercises.filter(ex => ex.completed).length;
    const total = exercises.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [exercises]);

  if (dailyWorkout.is_rest_day) {
    return <RestDayCard />;
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-5 h-5 text-blue-500" />
                {dailyWorkout.workout_name}
              </CardTitle>
              <div className={`flex items-center gap-4 mt-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {dailyWorkout.estimated_duration && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span>{dailyWorkout.estimated_duration} {t('exercise:minutes')}</span>
                  </div>
                )}
                {dailyWorkout.muscle_groups && dailyWorkout.muscle_groups.length > 0 && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Target className="w-4 h-4" />
                    <span>{dailyWorkout.muscle_groups.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Badge variant="outline" className="bg-white/80">
              {workoutStats.completed}/{workoutStats.total} {t('exercise:exercises')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Exercises List */}
      <div className="space-y-4">
        {sortedExercises.map((exercise, index) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={onExerciseComplete}
            onExerciseStart={onExerciseStart}
          />
        ))}
      </div>

      {/* Progress Summary */}
      {workoutStats.total > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {workoutStats.percentage}%
            </div>
            <p className="text-sm text-green-600">
              {t('exercise:workoutProgress')} • {workoutStats.completed}/{workoutStats.total} {t('exercise:exercisesCompleted')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

OptimizedExerciseDayView.displayName = 'OptimizedExerciseDayView';

export default OptimizedExerciseDayView;
