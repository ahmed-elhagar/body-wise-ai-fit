
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Clock } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface OptimizedExerciseListProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  workoutType: 'home' | 'gym';
  onExerciseStart: (index: number) => void;
  onExerciseComplete: (index: number) => void;
}

export const OptimizedExerciseList = ({
  exercises,
  currentExerciseIndex,
  workoutType,
  onExerciseStart,
  onExerciseComplete
}: OptimizedExerciseListProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {exercises.map((exercise, index) => {
        const isActive = index === currentExerciseIndex;
        const isCompleted = exercise.completed;
        const isPending = index > currentExerciseIndex;

        return (
          <Card key={exercise.id} className={`transition-all duration-300 ${
            isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 
            isCompleted ? 'bg-green-50 border-green-200' : ''
          }`}>
            <CardContent className="p-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Badge variant="outline" className="text-xs">
                        {exercise.sets} sets × {exercise.reps} reps
                      </Badge>
                      {exercise.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {exercise.duration}s
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {workoutType === 'home' ? t('exercise:home') : t('exercise:gym')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {!isCompleted && !isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onExerciseStart(index)}
                      disabled={isPending}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {t('exercise:start') || 'Start'}
                    </Button>
                  )}
                  
                  {isActive && (
                    <Button
                      size="sm"
                      onClick={() => onExerciseComplete(index)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {t('exercise:complete') || 'Complete'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OptimizedExerciseList;
