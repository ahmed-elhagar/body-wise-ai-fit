
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, CheckCircle, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
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
  const [isActive, setIsActive] = React.useState(false);

  const handleStart = () => {
    setIsActive(true);
    onExerciseStart(exercise.id);
  };

  const handleComplete = () => {
    setIsActive(false);
    onExerciseComplete(exercise.id);
  };

  // Safely access exercise properties with fallbacks
  const exerciseName = exercise.name || exercise.exercise_name || 'Unknown Exercise';
  const exerciseInstructions = exercise.instructions || 'No instructions available';
  const exerciseSets = exercise.sets || 3;
  const exerciseReps = exercise.reps || 12;
  const targetMuscles = exercise.target_muscles || exercise.muscle_group || [];

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-lg ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}>
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Exercise Number */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>

        {/* Exercise Details */}
        <div className="flex-1 min-w-0">
          <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{exerciseName}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {exerciseInstructions}
              </p>
            </div>
          </div>

          {/* Exercise Specs */}
          <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {exerciseSets} sets × {exerciseReps} reps
            </Badge>
            
            {Array.isArray(targetMuscles) && targetMuscles.length > 0 && (
              <Badge variant="outline">
                {targetMuscles.slice(0, 2).join(', ')}
                {targetMuscles.length > 2 && ` +${targetMuscles.length - 2}`}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!isActive ? (
              <Button onClick={handleStart} size="sm" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                {t('exercise:start') || 'Start'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleComplete} size="sm" variant="default" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t('exercise:complete') || 'Complete'}
                </Button>
                <Button onClick={() => setIsActive(false)} size="sm" variant="outline" className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  {t('exercise:pause') || 'Pause'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveExerciseCard;
