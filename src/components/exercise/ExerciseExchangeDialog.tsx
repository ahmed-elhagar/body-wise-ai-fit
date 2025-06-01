
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExerciseExchange } from '@/hooks/useExerciseExchange';
import { RefreshCw, AlertCircle, Zap } from 'lucide-react';

interface ExerciseExchangeDialogProps {
  exercise: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseExchangeDialog = ({
  exercise,
  open,
  onOpenChange
}: ExerciseExchangeDialogProps) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const { 
    exchangeExercise, 
    isExchanging, 
    weeklyExchangeCount, 
    remainingExchanges,
    canExchange 
  } = useExerciseExchange();

  const equipmentOptions = [
    'bodyweight', 'dumbbells', 'barbells', 'resistance_bands', 
    'kettlebells', 'pull_up_bar', 'yoga_mat', 'stability_ball'
  ];

  const reasonOptions = [
    { value: 'no_equipment', label: t('exercise.noEquipment') || 'I don\'t have the required equipment' },
    { value: 'too_difficult', label: t('exercise.tooDifficult') || 'Too difficult for me' },
    { value: 'too_easy', label: t('exercise.tooEasy') || 'Too easy for me' },
    { value: 'injury_concern', label: t('exercise.injuryConcern') || 'I have an injury or physical limitation' },
    { value: 'prefer_different', label: t('exercise.preferDifferent') || 'I prefer a different exercise type' },
    { value: 'not_enough_space', label: t('exercise.notEnoughSpace') || 'Not enough space' }
  ];

  const handleSubmit = () => {
    if (!reason) {
      return;
    }

    const selectedReasonLabel = reasonOptions.find(option => option.value === reason)?.label || reason;

    exchangeExercise({
      exerciseId: exercise.id,
      reason: selectedReasonLabel,
      preferences: {
        equipment: selectedEquipment.length > 0 ? selectedEquipment : undefined
      }
    });

    // Reset form
    setReason('');
    setSelectedEquipment([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-health-primary" />
            {t('exercise.exchangeExercise') || 'Exchange Exercise'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exchange Usage Info */}
          <div className="bg-health-soft rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-health-primary" />
              <span className="font-medium text-sm">
                {t('exercise.weeklyExchangeLimit') || 'Weekly Exchange Usage'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={canExchange ? "outline" : "destructive"}>
                {weeklyExchangeCount}/2 {t('exercise.used') || 'used'}
              </Badge>
              <span className="text-sm text-health-text-secondary">
                {remainingExchanges} {t('exercise.remaining') || 'remaining'}
              </span>
            </div>
          </div>

          {!canExchange && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  {t('exercise.exchangeLimitReached') || 'Exchange Limit Reached'}
                </p>
                <p className="text-sm text-red-600">
                  {t('exercise.exchangeLimitMessage') || 'You have used all 2 exercise exchanges for this week. Limit resets weekly.'}
                </p>
              </div>
            </div>
          )}

          {/* Current Exercise Info */}
          <div className="border border-health-border rounded-lg p-4">
            <h4 className="font-medium text-health-text-primary mb-2">
              {t('exercise.currentExercise') || 'Current Exercise'}
            </h4>
            <p className="text-sm text-health-text-secondary font-medium">{exercise.name}</p>
            {exercise.muscle_groups && (
              <div className="flex flex-wrap gap-1 mt-2">
                {exercise.muscle_groups.map((muscle: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {t(`exercise.${muscle}`) || muscle}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('exercise.exchangeReason') || 'Why do you want to exchange this exercise?'} *
            </label>
            <Select value={reason} onValueChange={setReason} disabled={!canExchange}>
              <SelectTrigger>
                <SelectValue placeholder={t('exercise.selectReason') || 'Select a reason'} />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Preferences */}
          <div>
            <label className="block text-sm font-medium mb-3">
              {t('exercise.preferredEquipment') || 'Available Equipment (optional)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {equipmentOptions.map((equipment) => (
                <label key={equipment} className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={selectedEquipment.includes(equipment)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEquipment([...selectedEquipment, equipment]);
                      } else {
                        setSelectedEquipment(selectedEquipment.filter(e => e !== equipment));
                      }
                    }}
                    disabled={!canExchange}
                  />
                  <span>{t(`exercise.${equipment}`) || equipment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('exercise.cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason || isExchanging || !canExchange}
              className="flex-1"
            >
              {isExchanging ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('exercise.exchanging') || 'Exchanging...'}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('exercise.exchange') || 'Exchange'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
