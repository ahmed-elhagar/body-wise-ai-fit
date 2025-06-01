import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { useExerciseExchange } from '@/hooks/useExerciseExchange';

interface ExerciseExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: any;
  onExerciseExchanged: () => void;
}

export const ExerciseExchangeDialog = ({
  open,
  onOpenChange,
  exercise,
  onExerciseExchanged
}: ExerciseExchangeDialogProps) => {
  const { t } = useI18n();
  const { getAlternativeExercises, alternatives, isLoading, error } = useExerciseExchange();
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);

  const handleGetAlternatives = async () => {
    await getAlternativeExercises(exercise);
  };

  const handleExchangeExercise = () => {
    // Implement the logic to exchange the exercise
    console.log('Exchanging exercise with:', selectedAlternative);
    onExerciseExchanged();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exercise.exchangeExercise')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">{exercise.name}</h3>
              <p className="text-sm text-gray-500">
                {exercise.sets} sets × {exercise.reps} reps
              </p>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p>{t('exercise.loadingAlternatives')}</p>
            </div>
          ) : error ? (
            <div className="text-red-500">{error.message}</div>
          ) : alternatives.length === 0 ? (
            <div className="text-center">
              <p>{t('exercise.noAlternativesFound')}</p>
              <Button onClick={handleGetAlternatives} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('exercise.tryAgain')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {alternatives.map((altExercise) => (
                <Card
                  key={altExercise.id}
                  className={`cursor-pointer ${
                    selectedAlternative?.id === altExercise.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedAlternative(altExercise)}
                >
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{altExercise.name}</h4>
                      <p className="text-sm text-gray-500">
                        {altExercise.sets} sets × {altExercise.reps} reps
                      </p>
                    </div>
                    {selectedAlternative?.id === altExercise.id && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleGetAlternatives}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('exercise.getAlternatives')}
                </>
              )}
            </Button>
            <Button
              onClick={handleExchangeExercise}
              disabled={!selectedAlternative}
            >
              {t('exercise.exchange')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
