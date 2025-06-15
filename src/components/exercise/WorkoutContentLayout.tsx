
import { ExerciseListEnhanced } from "@/features/exercise";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutContentLayoutProps {
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  currentProgram: any;
  selectedDayNumber: number;
  currentWeekOffset: number;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
}

export const WorkoutContentLayout = ({
  todaysExercises,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay
}: WorkoutContentLayoutProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <ExerciseListEnhanced 
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        isRestDay={isRestDay || false}
        selectedDayNumber={selectedDayNumber}
      />
    </div>
  );
};
