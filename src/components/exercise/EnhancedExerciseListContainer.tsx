
import { UnifiedExerciseContainer } from "./UnifiedExerciseContainer";

interface EnhancedExerciseListContainerProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  currentProgram: any;
  selectedDayNumber: number;
}

export const EnhancedExerciseListContainer = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  currentProgram,
  selectedDayNumber
}: EnhancedExerciseListContainerProps) => {
  return (
    <UnifiedExerciseContainer
      exercises={exercises}
      isLoading={isLoading}
      onExerciseComplete={onExerciseComplete}
      onExerciseProgressUpdate={onExerciseProgressUpdate}
      isRestDay={isRestDay}
      completedExercises={completedExercises}
      totalExercises={totalExercises}
      progressPercentage={progressPercentage}
      isToday={isToday}
      currentProgram={currentProgram}
      selectedDayNumber={selectedDayNumber}
    />
  );
};
