
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyWorkoutId?: string;
  onExerciseCreated: () => void;
}

export const CustomExerciseDialog = ({ open, onOpenChange, dailyWorkoutId, onExerciseCreated }: CustomExerciseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Exercise</DialogTitle>
        </DialogHeader>
        <p>Custom exercise dialog for workout {dailyWorkoutId}</p>
      </DialogContent>
    </Dialog>
  );
};
