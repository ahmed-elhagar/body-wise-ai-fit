
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseQuickActionsProps {
  isWorkoutActive: boolean;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onSkipExercise: () => void;
  onRestartWorkout: () => void;
}

const ExerciseQuickActions = ({
  isWorkoutActive,
  onStartWorkout,
  onPauseWorkout,
  onSkipExercise,
  onRestartWorkout
}: ExerciseQuickActionsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {!isWorkoutActive ? (
        <Button onClick={onStartWorkout} className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" />
          {t('exercise:startWorkout') || 'Start Workout'}
        </Button>
      ) : (
        <>
          <Button onClick={onPauseWorkout} variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            {t('exercise:pauseWorkout') || 'Pause'}
          </Button>
          <Button onClick={onSkipExercise} variant="outline">
            <SkipForward className="w-4 h-4 mr-2" />
            {t('exercise:skipExercise') || 'Skip'}
          </Button>
        </>
      )}
      <Button onClick={onRestartWorkout} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        {t('exercise:restartWorkout') || 'Restart'}
      </Button>
    </div>
  );
};

export default ExerciseQuickActions;
