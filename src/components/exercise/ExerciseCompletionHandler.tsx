
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Timer, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface ExerciseCompletionHandlerProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  isActive: boolean;
  isUpdating: boolean;
}

export const ExerciseCompletionHandler = ({
  exercise,
  onComplete,
  isActive,
  isUpdating
}: ExerciseCompletionHandlerProps) => {
  const { language } = useLanguage();
  const [hasError, setHasError] = useState(false);

  const handleExerciseComplete = async () => {
    if (isUpdating) {
      console.log('⚠️ Already updating, skipping duplicate call');
      return;
    }
    
    try {
      setHasError(false);
      console.log('✅ Marking exercise complete:', exercise.id);
      await onComplete(exercise.id);
    } catch (error: any) {
      console.error('❌ Error completing exercise:', error);
      setHasError(true);
    }
  };

  if (exercise.completed) {
    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />
        {language === 'ar' ? 'مكتمل' : 'Completed'}
      </Badge>
    );
  }

  if (hasError) {
    return (
      <Badge variant="destructive" className="bg-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        {language === 'ar' ? 'خطأ' : 'Error'}
      </Badge>
    );
  }

  // Show quick complete button for non-active exercises
  if (!isActive) {
    return (
      <Button
        onClick={handleExerciseComplete}
        disabled={isUpdating}
        className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      >
        {isUpdating ? (
          <>
            <Timer className="w-4 h-4 mr-2 animate-spin" />
            {language === 'ar' ? 'جاري التحديث...' : 'Updating...'}
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إكمال' : 'Mark as Complete'}
          </>
        )}
      </Button>
    );
  }

  return null;
};
