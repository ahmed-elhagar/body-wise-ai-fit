
import { useI18n } from '@/hooks/useI18n';
import ExerciseHeader from './ExerciseHeader';

interface ExercisePageHeaderProps {
  currentProgram: any;
  weekStartDate: Date;
  currentWeekOffset: number;
  workoutType: "home" | "gym";
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  isGenerating: boolean;
}

export const ExercisePageHeader = ({
  currentProgram,
  weekStartDate,
  currentWeekOffset,
  workoutType,
  onWeekChange,
  onShowAIDialog,
  onRegenerateProgram,
  onWorkoutTypeChange,
  isGenerating
}: ExercisePageHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <ExerciseHeader
        currentProgram={currentProgram}
        weekStartDate={weekStartDate}
        currentWeekOffset={currentWeekOffset}
        workoutType={workoutType}
        onWeekChange={onWeekChange}
        onShowAIDialog={onShowAIDialog}
        onRegenerateProgram={onRegenerateProgram}
        onWorkoutTypeChange={onWorkoutTypeChange}
        isGenerating={isGenerating}
      />
    </div>
  );
};
