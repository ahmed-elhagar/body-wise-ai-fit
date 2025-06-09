
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExerciseInstructionsDialogProps {
  exercise: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseInstructionsDialog = ({ 
  exercise, 
  open, 
  onOpenChange 
}: ExerciseInstructionsDialogProps) => {
  const { t } = useLanguage();

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {exercise.name} - {t('Instructions')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {exercise.instructions ? (
            <div className="prose prose-sm max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">{t('How to perform')}:</h4>
                <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {exercise.instructions}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('No instructions available for this exercise')}</p>
            </div>
          )}

          {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{t('Target Muscles')}:</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.muscle_groups.map((muscle: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(exercise.sets || exercise.reps || exercise.rest_seconds) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">{t('Workout Details')}:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {exercise.sets && (
                  <div className="text-center">
                    <div className="font-bold text-green-800">{exercise.sets}</div>
                    <div className="text-green-600">{t('Sets')}</div>
                  </div>
                )}
                {exercise.reps && (
                  <div className="text-center">
                    <div className="font-bold text-green-800">{exercise.reps}</div>
                    <div className="text-green-600">{t('Reps')}</div>
                  </div>
                )}
                {exercise.rest_seconds && (
                  <div className="text-center">
                    <div className="font-bold text-green-800">{exercise.rest_seconds}s</div>
                    <div className="text-green-600">{t('Rest')}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
