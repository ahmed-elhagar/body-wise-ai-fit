
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSnack: (snack: { name: string; calories: number; notes?: string }) => void;
}

const AddSnackDialog = ({ isOpen, onClose, onAddSnack }: AddSnackDialogProps) => {
  const { t } = useLanguage();
  const [snackName, setSnackName] = useState('');
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (snackName && calories > 0) {
      onAddSnack({
        name: snackName,
        calories,
        notes: notes || undefined
      });
      setSnackName('');
      setCalories(0);
      setNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Add Snack')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="snackName">{t('Snack Name')}</Label>
            <Input
              id="snackName"
              value={snackName}
              onChange={(e) => setSnackName(e.target.value)}
              placeholder={t('Enter snack name...')}
            />
          </div>

          <div>
            <Label htmlFor="calories">{t('Calories')}</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="notes">{t('Notes')} ({t('Optional')})</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('Add notes...')}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t('Add Snack')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;
