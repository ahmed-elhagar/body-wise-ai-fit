
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Loader2 } from 'lucide-react';

interface ExchangeExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onExchange: (reason: string) => void;
  exerciseName: string;
  isExchanging: boolean;
}

const exchangeReasons = [
  { value: 'too_difficult', label: 'Too difficult for my level' },
  { value: 'equipment_not_available', label: 'Equipment not available' },
  { value: 'injury_concern', label: 'Have injury concerns' },
  { value: 'prefer_alternative', label: 'Prefer different exercise' },
  { value: 'custom', label: 'Other reason (specify below)' }
];

export const ExchangeExerciseDialog: React.FC<ExchangeExerciseDialogProps> = ({
  open,
  onClose,
  onExchange,
  exerciseName,
  isExchanging
}) => {
  const [selectedReason, setSelectedReason] = useState('too_difficult');
  const [customReason, setCustomReason] = useState('');

  const handleExchange = () => {
    const reason = selectedReason === 'custom' ? customReason : selectedReason;
    if (reason.trim()) {
      onExchange(reason);
    }
  };

  const handleClose = () => {
    setSelectedReason('too_difficult');
    setCustomReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Exchange Exercise
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Why do you want to exchange <span className="font-medium">{exerciseName}</span>?
          </p>

          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {exchangeReasons.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="text-sm">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === 'custom' && (
            <Textarea
              placeholder="Please specify your reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[80px]"
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExchanging}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExchange}
              disabled={isExchanging || (selectedReason === 'custom' && !customReason.trim())}
              className="flex-1"
            >
              {isExchanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exchanging...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Exchange
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
