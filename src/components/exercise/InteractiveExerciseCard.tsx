
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Check, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface InteractiveExerciseCardProps {
  exercise: Exercise;
  isActive?: boolean;
  onStart: () => void;
  onComplete: () => void;
}

const InteractiveExerciseCard = ({ 
  exercise, 
  isActive = false, 
  onStart, 
  onComplete 
}: InteractiveExerciseCardProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className={`transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardContent className="p-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {exercise.name || 'Exercise'}
            </h3>
            
            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="secondary">
                {exercise.muscle_groups?.join(', ') || 'Full Body'}
              </Badge>
              <Badge variant="outline">
                {exercise.difficulty || 'Beginner'}
              </Badge>
            </div>

            <div className={`flex items-center gap-4 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4" />
                <span>{exercise.duration || 30} {t('common:seconds') || 'sec'}</span>
              </div>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Target className="w-4 h-4" />
                <span>{exercise.sets || 3} {t('exercise:sets') || 'sets'}</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={onStart}
              disabled={!isActive}
              variant={isActive ? "default" : "outline"}
            >
              <Play className="w-4 h-4 mr-2" />
              {t('exercise:start') || 'Start'}
            </Button>
            {isActive && (
              <Button onClick={onComplete} variant="outline">
                <Check className="w-4 h-4 mr-2" />
                {t('exercise:complete') || 'Complete'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveExerciseCard;
