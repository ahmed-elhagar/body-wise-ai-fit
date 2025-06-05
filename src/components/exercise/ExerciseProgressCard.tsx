
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Target
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';
import { ExerciseActionsMenu } from './ExerciseActionsMenu';
import { ExerciseVideoDialog } from './ExerciseVideoDialog';
import { ExerciseExchangeDialog } from './ExerciseExchangeDialog';
import { ExerciseSetTracker } from './ExerciseSetTracker';
import { ExerciseCompletionHandler } from './ExerciseCompletionHandler';

interface ExerciseProgressCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive?: boolean;
  onSetActive?: () => void;
}

export const ExerciseProgressCard = ({ 
  exercise, 
  onComplete, 
  onProgressUpdate, 
  isActive = false,
  onSetActive 
}: ExerciseProgressCardProps) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState(exercise.notes || '');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalSets = exercise.sets || 3;
  const completedSets = exercise.actual_sets || 0;
  const progressPercentage = (completedSets / totalSets) * 100;

  const handleSetComplete = async (setIndex: number) => {
    console.log('Set completed:', setIndex);
  };

  const handleProgressUpdate = async (sets: number, reps: string, weight?: number) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await onProgressUpdate(exercise.id, sets, reps, notes, weight);
    } catch (error) {
      console.error('❌ Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await onComplete(exerciseId);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className={`p-4 transition-all duration-200 ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${exercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
        
        {/* Exercise Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
              {exercise.completed && (
                <ExerciseCompletionHandler
                  exercise={exercise}
                  onComplete={handleExerciseComplete}
                  isActive={isActive}
                  isUpdating={isUpdating}
                />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {totalSets} {t('sets')} × {exercise.reps} {t('reps')}
              </span>
              {exercise.equipment && (
                <span className="text-blue-600">
                  {exercise.equipment}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ExerciseActionsMenu
              exercise={exercise}
              onShowVideo={() => setShowVideoDialog(true)}
              onShowExchange={() => setShowExchangeDialog(true)}
            />
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={onSetActive}
              className="shrink-0"
              disabled={isUpdating}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  {t('Active')}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  {t('Start')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{t('Progress')}</span>
            <span className="font-medium">{completedSets}/{totalSets} {t('sets')}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Exercise Completion Handler - Only show for non-active exercises */}
        {!isActive && !exercise.completed && (
          <div className="mb-4">
            <ExerciseCompletionHandler
              exercise={exercise}
              onComplete={handleExerciseComplete}
              isActive={isActive}
              isUpdating={isUpdating}
            />
          </div>
        )}

        {/* Sets Tracking - Only show when active */}
        <ExerciseSetTracker
          exerciseId={exercise.id}
          totalSets={totalSets}
          defaultReps={parseInt(exercise.reps || '12')}
          restSeconds={exercise.rest_seconds || 60}
          onSetComplete={handleSetComplete}
          onProgressUpdate={handleProgressUpdate}
          isActive={isActive}
          isUpdating={isUpdating}
          initialActualSets={exercise.actual_sets}
          initialActualReps={exercise.actual_reps}
        />

        {/* Exercise Instructions */}
        {exercise.instructions && (
          <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            <strong>{t('Instructions')}:</strong> {exercise.instructions}
          </div>
        )}

        {/* Notes */}
        {isActive && (
          <div className="mt-3">
            <Input
              placeholder={t('Add notes about this exercise...')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm"
              disabled={isUpdating}
            />
          </div>
        )}
      </Card>

      {/* Video Dialog */}
      <ExerciseVideoDialog
        exercise={exercise}
        open={showVideoDialog}
        onOpenChange={setShowVideoDialog}
      />

      {/* Exchange Dialog */}
      <ExerciseExchangeDialog
        exercise={exercise}
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
      />
    </>
  );
};
