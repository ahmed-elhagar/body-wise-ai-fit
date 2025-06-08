
import React, { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import ExercisePageHeader from './ExercisePageHeader';
import ExercisePageContent from './ExercisePageContent';
import ExerciseDaySelector from './ExerciseDaySelector';

interface ExercisePageRefactoredProps {
  exercises: Exercise[];
  selectedDay: number;
  onDayChange: (day: number) => void;
  workoutType: 'home' | 'gym';
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
  isGenerating?: boolean;
}

const ExercisePageRefactored = ({
  exercises,
  selectedDay,
  onDayChange,
  workoutType,
  onRegenerateProgram,
  onCustomizeProgram,
  isGenerating = false
}: ExercisePageRefactoredProps) => {
  const { t, isRTL } = useI18n();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const handleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
  };

  const handleExerciseProgressUpdate = (exerciseId: string, sets: number, reps: string, notes?: string) => {
    console.log('Exercise progress updated:', { exerciseId, sets, reps, notes });
  };

  const isRestDay = selectedDay === 7; // Sunday as rest day

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <ExercisePageHeader
        title={t('exercise:exerciseProgram') || 'Exercise Program'}
        workoutType={workoutType}
        selectedDay={selectedDay}
        onRegenerateProgram={onRegenerateProgram}
        onCustomizeProgram={onCustomizeProgram}
        isGenerating={isGenerating}
      />

      <ExerciseDaySelector
        selectedDay={selectedDay}
        onDaySelect={onDayChange}
      />

      <ExercisePageContent
        exercises={exercises}
        selectedDay={selectedDay}
        workoutType={workoutType}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        isRestDay={isRestDay}
      />
    </div>
  );
};

export default ExercisePageRefactored;
