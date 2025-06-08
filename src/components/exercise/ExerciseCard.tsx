
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Youtube, Timer } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: string;
    instructions?: string;
    completed?: boolean;
    rest_seconds?: number;
  };
  onComplete?: (id: string) => void;
  onStart?: (id: string) => void;
}

const ExerciseCard = ({ exercise, onComplete, onStart }: ExerciseCardProps) => {
  const { t, isRTL } = useI18n();
  const [isCompleted, setIsCompleted] = useState(exercise.completed || false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.(exercise.id);
  };

  const handleStart = () => {
    onStart?.(exercise.id);
  };

  return (
    <Card className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
            <div className={`flex items-center gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{exercise.sets} {t('exercise:sets') || 'sets'}</span>
              <span>{exercise.reps} {t('exercise:reps') || 'reps'}</span>
              {exercise.rest_seconds && (
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Timer className="w-3 h-3" />
                  <span>{exercise.rest_seconds}s {t('exercise:rest') || 'rest'}</span>
                </div>
              )}
            </div>
            {exercise.instructions && (
              <p className="text-sm text-gray-600 mt-2">{exercise.instructions}</p>
            )}
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {isCompleted ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('exercise:completed') || 'Completed'}
              </Badge>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleStart}>
                  <Play className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleComplete}>
                  {t('exercise:complete') || 'Complete'}
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm">
              <Youtube className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
