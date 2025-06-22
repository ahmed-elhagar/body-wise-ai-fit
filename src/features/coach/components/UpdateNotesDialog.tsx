
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface UpdateNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNotes?: string;
  onUpdate: (notes: string) => void;
  isLoading?: boolean;
}

const UpdateNotesDialog: React.FC<UpdateNotesDialogProps> = ({
  open,
  onOpenChange,
  currentNotes = '',
  onUpdate,
  isLoading = false
}) => {
  const [notes, setNotes] = useState(currentNotes);

  const handleUpdate = () => {
    onUpdate(notes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Notes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this trainee..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Notes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNotesDialog;
