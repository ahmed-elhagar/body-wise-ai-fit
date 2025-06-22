
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCoachMutations } from "@/features/coach/hooks/useCoachMutations";
import { useLanguage } from "@/contexts/LanguageContext";
import UserSearchDropdown from "./UserSearchDropdown";

interface AssignTraineeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (data: { traineeId: string; notes?: string }) => void;
}

const AssignTraineeDialog = ({ isOpen, onClose, onAssign }: AssignTraineeDialogProps) => {
  const { t } = useLanguage();
  const { assignTrainee, isAssigning } = useCoachMutations();
  const [selectedTraineeId, setSelectedTraineeId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTraineeId) return;

    try {
      if (onAssign) {
        onAssign({ traineeId: selectedTraineeId, notes });
      } else {
        assignTrainee({ traineeId: selectedTraineeId, notes });
      }
      
      // Reset form and close
      setSelectedTraineeId('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error assigning trainee:', error);
    }
  };

  const handleClose = () => {
    setSelectedTraineeId('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Assign New Trainee')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('Select Trainee')} *</Label>
            <UserSearchDropdown
              onSelect={setSelectedTraineeId}
              selectedUserId={selectedTraineeId}
              placeholder={t('Search and select a trainee...')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('Notes')} ({t('Optional')})</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('Add any notes about this trainee...')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={isAssigning || !selectedTraineeId}>
              {isAssigning ? t('Assigning...') : t('Assign Trainee')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTraineeDialog;
