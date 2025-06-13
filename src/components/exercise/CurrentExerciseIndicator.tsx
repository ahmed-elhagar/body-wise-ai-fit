
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/features/exercise/types';

interface CurrentExerciseIndicatorProps {
  isSessionActive: boolean;
  currentExercise: Exercise | null;
  onMoveToNext: () => void;
  canMoveNext: boolean;
}

export const CurrentExerciseIndicator = ({
  isSessionActive,
  currentExercise,
  onMoveToNext,
  canMoveNext
}: CurrentExerciseIndicatorProps) => {
  const { t } = useLanguage();

  if (!isSessionActive || !currentExercise) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-blue-800">{t('Current Exercise')}</div>
          <div className="font-bold text-gray-900">
            {currentExercise.name}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveToNext}
          disabled={!canMoveNext}
        >
          {t('Next Exercise')}
        </Button>
      </div>
    </div>
  );
};
