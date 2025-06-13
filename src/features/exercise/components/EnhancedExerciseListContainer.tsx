
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '../types';
import { CustomExerciseDialog } from '@/components/exercise/CustomExerciseDialog';
import { RestDayCard } from './RestDayCard';
import { ExerciseEmptyState } from './ExerciseEmptyState';
import { ExerciseListHeader } from './ExerciseListHeader';
import { ExerciseSessionView } from './ExerciseSessionView';
import { ExerciseListView } from './ExerciseListView';

interface EnhancedExerciseListContainerProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
  isLoading?: boolean;
  completedExercises?: number;
  totalExercises?: number;
  progressPercentage?: number;
  isToday?: boolean;
  currentProgram?: any;
  selectedDayNumber?: number;
}

export const EnhancedExerciseListContainer = ({ 
  exercises, 
  onExerciseComplete, 
  onExerciseProgressUpdate,
  isRestDay = false,
  isLoading = false,
  completedExercises = 0,
  totalExercises = 0,
  progressPercentage = 0,
  isToday = false,
  currentProgram,
  selectedDayNumber = 1
}: EnhancedExerciseListContainerProps) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'session' | 'list'>('session');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);

  const dailyWorkoutId = currentProgram?.daily_workouts?.find(
    (workout: any) => workout.day_number === selectedDayNumber
  )?.id;

  const handleSessionComplete = () => {
    console.log('🏆 Workout session completed!');
  };

  const handleSetActive = (exerciseId: string) => {
    setActiveExerciseId(current => current === exerciseId ? null : exerciseId);
  };

  const actualCompletedCount = exercises.filter(ex => ex.completed).length;
  const actualTotalCount = exercises.length;

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <>
        <ExerciseEmptyState
          onGenerateProgram={() => console.log('Generate program')}
          workoutType="home"
          dailyWorkoutId={dailyWorkoutId}
        />
        
        <CustomExerciseDialog
          open={showCustomExerciseDialog}
          onOpenChange={setShowCustomExerciseDialog}
          dailyWorkoutId={dailyWorkoutId}
          onExerciseCreated={() => {
            window.location.reload();
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <ExerciseListHeader
          completedCount={actualCompletedCount}
          totalCount={actualTotalCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          dailyWorkoutId={dailyWorkoutId}
        />

        {viewMode === 'session' ? (
          <ExerciseSessionView
            exercises={exercises}
            activeExerciseId={activeExerciseId}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            onSessionComplete={handleSessionComplete}
            onSetActive={handleSetActive}
            onDeactivate={() => setActiveExerciseId(null)}
          />
        ) : (
          <ExerciseListView
            exercises={exercises}
            onExerciseComplete={onExerciseComplete}
          />
        )}
      </div>

      <CustomExerciseDialog
        open={showCustomExerciseDialog}
        onOpenChange={setShowCustomExerciseDialog}
        dailyWorkoutId={dailyWorkoutId}
        onExerciseCreated={() => {
          window.location.reload();
        }}
      />
    </>
  );
};
