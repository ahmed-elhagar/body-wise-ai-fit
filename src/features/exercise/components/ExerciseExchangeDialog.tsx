
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Exercise } from '@/types/exercise';

interface ExerciseExchangeDialogProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseExchangeDialog: React.FC<ExerciseExchangeDialogProps> = ({
  exercise,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [isExchanging, setIsExchanging] = useState(false);

  const handleExchange = async () => {
    setIsExchanging(true);
    // TODO: Implement exercise exchange logic
    setTimeout(() => {
      setIsExchanging(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Exchange Exercise')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{t('Current Exercise')}</h3>
            <p className="text-gray-600">{exercise.name}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">{t('Alternative Exercises')}</h3>
            <p className="text-gray-500">{t('Loading alternatives...')}</p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleExchange} 
              disabled={isExchanging}
              className="flex-1"
            >
              {isExchanging ? t('Exchanging...') : t('Exchange Exercise')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExchanging}
            >
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
