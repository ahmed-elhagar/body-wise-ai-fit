
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Exercise } from '@/types/exercise';

interface ExerciseVideoDialogProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseVideoDialog: React.FC<ExerciseVideoDialogProps> = ({
  exercise,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exercise.name} - {t('Video Guide')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {exercise.video_url ? (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <iframe
                src={exercise.video_url}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={`${exercise.name} demonstration`}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">{t('No video available for this exercise')}</p>
            </div>
          )}
          
          {exercise.instructions && (
            <div>
              <h3 className="font-semibold mb-2">{t('Instructions')}</h3>
              <p className="text-gray-600">{exercise.instructions}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
