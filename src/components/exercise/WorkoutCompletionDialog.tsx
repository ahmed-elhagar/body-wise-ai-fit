import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/hooks/useI18n";

interface WorkoutCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const WorkoutCompletionDialog = ({ open, onOpenChange, onComplete }: WorkoutCompletionDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exercise.completeWorkoutConfirmation')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{t('exercise.completeWorkoutMessage')}</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => onOpenChange(false)}
            >
              {t('exercise.cancel')}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={onComplete}
            >
              {t('exercise.complete')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
