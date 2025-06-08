
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface UpdateNotesDialogProps {
  trainee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (traineeId: string, notes: string) => void;
}

const UpdateNotesDialog = ({ trainee, open, onOpenChange, onSave }: UpdateNotesDialogProps) => {
  const { t } = useI18n();
  const [notes, setNotes] = useState(trainee?.notes || '');

  const handleSave = () => {
    onSave(trainee.id, notes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('coach:updateNotes') || 'Update Notes'} - {trainee?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('coach:notesPlaceholder') || 'Add notes about this trainee...'}
            rows={6}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              {t('common:cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {t('common:save') || 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNotesDialog;
