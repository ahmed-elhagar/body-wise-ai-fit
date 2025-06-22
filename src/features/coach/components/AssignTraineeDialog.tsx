
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface AssignTraineeDialogProps {
  onAssign: (traineeId: string, notes?: string) => void;
  isLoading?: boolean;
}

const AssignTraineeDialog: React.FC<AssignTraineeDialogProps> = ({
  onAssign,
  isLoading = false
}) => {
  const [open, setOpen] = useState(false);
  const [traineeId, setTraineeId] = useState('');
  const [notes, setNotes] = useState('');

  const handleAssign = () => {
    if (traineeId.trim()) {
      onAssign(traineeId.trim(), notes.trim() || undefined);
      setTraineeId('');
      setNotes('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Trainee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Trainee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="traineeId">Trainee ID</Label>
            <Input
              id="traineeId"
              value={traineeId}
              onChange={(e) => setTraineeId(e.target.value)}
              placeholder="Enter trainee ID"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this trainee"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!traineeId.trim() || isLoading}>
              {isLoading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTraineeDialog;
