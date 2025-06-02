
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AddSnackDialogProps } from '../../types';

export const AddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  weeklyPlanId,
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: AddSnackDialogProps) => {
  
  const handleAddSnack = () => {
    // TODO: Implement add snack logic
    console.log('Adding snack for day:', selectedDay);
    onSnackAdded();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Snack
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Add a healthy snack to your meal plan for today.
          </p>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddSnack} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
