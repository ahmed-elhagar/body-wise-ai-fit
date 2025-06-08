
import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import ExerciseListEnhanced from './ExerciseListEnhanced';

interface ExercisePageContentProps {
  exercises: Exercise[];
  selectedDay: number;
  workoutType: 'home' | 'gym';
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

const ExercisePageContent = ({
  exercises,
  selectedDay,
  workoutType,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: ExercisePageContentProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <ExerciseListEnhanced
        exercises={exercises}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        workoutType={workoutType}
        isRestDay={isRestDay}
      />
    </div>
  );
};

export default ExercisePageContent;
