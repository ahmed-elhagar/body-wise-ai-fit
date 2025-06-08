
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/useI18n';
import { UserPlus } from 'lucide-react';

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (traineeEmail: string) => void;
  isLoading?: boolean;
}

export const AssignTraineeDialog = ({ 
  open, 
  onOpenChange, 
  onAssign, 
  isLoading = false 
}: AssignTraineeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAssign(email.trim());
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <UserPlus className="w-5 h-5" />
            {t('coach:assignTrainee') || 'Assign New Trainee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee-email">
              {t('coach:traineeEmail') || 'Trainee Email'}
            </Label>
            <Input
              id="trainee-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('coach:enterTraineeEmail') || 'Enter trainee email address'}
              required
            />
          </div>

          <div className={`flex gap-2 justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common:cancel') || 'Cancel'}
            </Button>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading ? t('common:assigning') || 'Assigning...' : t('coach:assign') || 'Assign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTraineeDialog;
