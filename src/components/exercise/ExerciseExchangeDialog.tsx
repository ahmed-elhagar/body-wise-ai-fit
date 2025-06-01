
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Sparkles, Dumbbell, Clock } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { useExerciseExchange } from "@/hooks/useExerciseExchange";

interface ExerciseExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: any;
  onExchange: () => void;
}

const ExerciseExchangeDialog = ({ isOpen, onClose, currentExercise, onExchange }: ExerciseExchangeDialogProps) => {
  const { t } = useI18n();
  const { exchangeExercise, isExchanging } = useExerciseExchange();
  const [alternatives, setAlternatives] = useState<any[]>([]);

  const handleGenerateAlternatives = async () => {
    // Mock alternatives for now
    const mockAlternatives = [
      {
        name: "Alternative Exercise 1",
        muscle_groups: currentExercise.muscle_groups,
        difficulty: currentExercise.difficulty,
        equipment: currentExercise.equipment,
        reason: "Similar muscle targeting with different movement pattern"
      },
      {
        name: "Alternative Exercise 2",
        muscle_groups: currentExercise.muscle_groups,
        difficulty: currentExercise.difficulty,
        equipment: "bodyweight",
        reason: "Bodyweight alternative for same muscle groups"
      }
    ];
    setAlternatives(mockAlternatives);
  };

  const handleExchange = async (alternative: any) => {
    try {
      await exchangeExercise({
        exerciseId: currentExercise.id,
        programId: currentExercise.daily_workout_id,
        dayNumber: 1
      });
      onExchange();
      onClose();
    } catch (error) {
      console.error('Error exchanging exercise:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            {t('Exchange Exercise')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Exercise Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{t('Current Exercise')}</h3>
              <p className="mb-3">{currentExercise.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>
                  <Dumbbell className="w-3 h-3 mr-1" />
                  {currentExercise.sets} x {currentExercise.reps}
                </Badge>
                {currentExercise.rest_seconds && (
                  <Badge>
                    <Clock className="w-3 h-3 mr-1" />
                    {currentExercise.rest_seconds}s rest
                  </Badge>
                )}
                <Badge variant="outline">
                  {currentExercise.difficulty}
                </Badge>
              </div>

              {currentExercise.muscle_groups && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{t('Muscle Groups')}: </span>
                  {currentExercise.muscle_groups.join(', ')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Alternatives Button */}
          {alternatives.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('AI Exercise Exchange')}
                </h3>
                <p className="text-sm mb-4">
                  {t('AI will find similar exercises targeting the same muscle groups and difficulty level.')}
                </p>
                
                <Button
                  onClick={handleGenerateAlternatives}
                  disabled={isExchanging}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isExchanging ? t('Finding Alternatives...') : t('Find Exercise Alternatives')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Alternatives List */}
          {alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">{t('Alternative Exercises')}:</h3>
              {alternatives.map((alternative, index) => (
                <Card key={index} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{alternative.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alternative.reason}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>{t('Difficulty')}: {alternative.difficulty}</span>
                          <span>{t('Equipment')}: {alternative.equipment}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleExchange(alternative)}
                        disabled={isExchanging}
                        size="sm"
                      >
                        {isExchanging ? t('Exchanging...') : t('Select')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t('Cancel')}
            </Button>
            {alternatives.length > 0 && (
              <Button
                onClick={handleGenerateAlternatives}
                disabled={isExchanging}
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('Generate More')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseExchangeDialog;
