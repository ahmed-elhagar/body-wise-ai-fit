
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, RotateCcw, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import ExerciseExchangeDialog from './ExerciseExchangeDialog';
import { Exercise } from '@/types/exercise';

interface InteractiveExerciseCardProps {
  exercise: Exercise;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseStart: (exerciseId: string) => void;
}

const InteractiveExerciseCard = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseStart
}: InteractiveExerciseCardProps) => {
  const { t, isRTL } = useI18n();
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  const handleExchange = (newExercise: any) => {
    console.log('Exchanging exercise:', exercise.name, 'with:', newExercise);
    setShowExchangeDialog(false);
  };

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-lg ${
        exercise.completed ? 'bg-green-50 border-green-200' : ''
      }`}>
        <CardContent className="p-6">
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              exercise.completed ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {exercise.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </div>

            <div className={`flex-1 space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                {exercise.description && (
                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                )}
              </div>

              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="outline" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Target className="w-3 h-3" />
                  {exercise.sets} sets × {exercise.reps} reps
                </Badge>
                
                {exercise.duration && (
                  <Badge variant="outline" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-3 h-3" />
                    {exercise.duration}s
                  </Badge>
                )}

                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <Badge variant="secondary">
                    {exercise.muscle_groups.join(', ')}
                  </Badge>
                )}
              </div>

              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {!exercise.completed ? (
                  <Button onClick={() => onExerciseStart(exercise.id)} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    {t('exercise:start') || 'Start'}
                  </Button>
                ) : (
                  <Button variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('exercise:completed') || 'Completed'}
                  </Button>
                )}

                <Button variant="outline" onClick={() => setShowExchangeDialog(true)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('exercise:exchange') || 'Exchange'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExerciseExchangeDialog
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
        onExchange={handleExchange}
      />
    </>
  );
};

export default InteractiveExerciseCard;
