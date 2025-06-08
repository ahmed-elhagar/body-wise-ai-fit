
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import InteractiveExerciseCard from './InteractiveExerciseCard';
import { Exercise } from '@/types/exercise';

interface UnifiedExerciseContainerProps {
  exercises: Exercise[];
  selectedDay: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseStart: (exerciseId: string) => void;
  workoutType: 'home' | 'gym';
}

export const UnifiedExerciseContainer = ({
  exercises,
  selectedDay,
  onExerciseComplete,
  onExerciseStart,
  workoutType
}: UnifiedExerciseContainerProps) => {
  const { t, isRTL } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const handleExerciseStart = (exerciseId: string) => {
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1) {
      setCurrentExerciseIndex(index);
      onExerciseStart(exerciseId);
    }
  };

  const handleExerciseComplete = (exerciseId: string) => {
    onExerciseComplete(exerciseId);
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1 && index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
    }
  };

  if (exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">
          {t('exercise:noExercisesFound') || 'No exercises found for this day'}
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {exercises.map((exercise, index) => (
        <InteractiveExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
          onExerciseComplete={handleExerciseComplete}
          onExerciseStart={handleExerciseStart}
        />
      ))}
    </div>
  );
};

export default UnifiedExerciseContainer;
