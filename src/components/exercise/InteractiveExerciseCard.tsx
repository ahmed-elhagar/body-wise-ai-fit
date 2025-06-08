
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Youtube, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import ExerciseExchangeDialog from './ExerciseExchangeDialog';

interface InteractiveExerciseCardProps {
  exercise: Exercise;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseStart: (exerciseId: string) => void;
  isActive?: boolean;
}

const InteractiveExerciseCard = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseStart,
  isActive = false
}: InteractiveExerciseCardProps) => {
  const { t, isRTL } = useI18n();
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  const handleWatchVideo = () => {
    const searchQuery = exercise.youtube_search_term || exercise.name;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <>
      <Card className={`transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${exercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
        <CardContent className="p-4">
          <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
                <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                {exercise.completed && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
              
              <div className={`text-sm text-gray-600 space-y-1 ${isRTL ? 'text-right' : ''}`}>
                {exercise.sets && (
                  <p>{exercise.sets} {t('exercise:sets')} × {exercise.reps} {t('exercise:reps')}</p>
                )}
                {exercise.equipment && (
                  <p>{t('exercise:equipment')}: {exercise.equipment}</p>
                )}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <p>{t('exercise:targetMuscles')}: {exercise.muscle_groups.join(', ')}</p>
                )}
              </div>
            </div>
          </div>

          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!exercise.completed ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onExerciseStart(exercise.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isActive ? t('exercise:continue') : t('exercise:start')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowExchangeDialog(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('exercise:exchange')}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onExerciseComplete(exercise.id)}
                className="bg-green-100 text-green-700 border-green-200"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('exercise:completed')}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleWatchVideo}
            >
              <Youtube className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExerciseExchangeDialog
        exercise={exercise}
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
        onExchange={(newExercise) => {
          console.log('Exercise exchanged:', newExercise);
          setShowExchangeDialog(false);
        }}
      />
    </>
  );
};

export default InteractiveExerciseCard;
