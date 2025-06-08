
import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import ExerciseDaySelector from './ExerciseDaySelector';
import ExerciseListEnhanced from './ExerciseListEnhanced';
import { RestDayCard } from './RestDayCard';
import ExercisePageHeader from './ExercisePageHeader';

interface ExerciseProgramPageContentProps {
  exercises: Exercise[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
  workoutType: 'home' | 'gym';
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
  isGenerating?: boolean;
  isRestDay?: boolean;
}

const ExerciseProgramPageContent = ({
  exercises,
  selectedDay,
  onDaySelect,
  workoutType,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onRegenerateProgram,
  onCustomizeProgram,
  isGenerating = false,
  isRestDay = false
}: ExerciseProgramPageContentProps) => {
  const { t, isRTL } = useI18n();

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
        onDaySelect={onDaySelect}
      />

      {isRestDay ? (
        <RestDayCard />
      ) : (
        <ExerciseListEnhanced
          exercises={exercises}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          workoutType={workoutType}
          isRestDay={isRestDay}
        />
      )}
    </div>
  );
};

export default ExerciseProgramPageContent;
