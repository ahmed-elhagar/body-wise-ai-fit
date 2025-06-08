
import { useI18n } from '@/hooks/useI18n';
import DayTabs from '../meal-plan/DayTabs';
import ExerciseList from './ExerciseList';

interface ExercisePageMainContentProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (day: number) => void;
  todaysExercises: any[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay: boolean;
}

export const ExercisePageMainContent = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  todaysExercises,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay
}: ExercisePageMainContentProps) => {
  const { t } = useI18n();

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <DayTabs
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDayChange={onDayChange}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <ExerciseList
          exercises={todaysExercises}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />
      </div>
    </div>
  );
};
