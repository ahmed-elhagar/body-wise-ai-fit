
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Exercise } from "@/types/exercise";
import { EnhancedExerciseListContainer } from "./EnhancedExerciseListContainer";

interface ExerciseListEnhancedProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => void;
  isRestDay?: boolean;
}

export const ExerciseListEnhanced = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">{t('Loading exercises...')}</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedExerciseListContainer
      exercises={exercises}
      onExerciseComplete={onExerciseComplete}
      onExerciseProgressUpdate={onExerciseProgressUpdate}
      isRestDay={isRestDay}
    />
  );
};
