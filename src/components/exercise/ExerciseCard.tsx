import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Target,
  CheckCircle,
  Timer
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';
import { ExerciseActionsMenu } from '@/features/exercise/components/ExerciseActionsMenu';
import { ExerciseVideoDialog } from '@/features/exercise/components/ExerciseVideoDialog';
import { ExerciseExchangeDialog } from '@/features/exercise/components/ExerciseExchangeDialog';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive?: boolean;
  onSetActive?: () => void;
}

export const ExerciseCard = ({ 
  exercise, 
  onComplete, 
  onProgressUpdate, 
  isActive = false,
  onSetActive 
}: ExerciseCardProps) => {
  const { t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  const totalSets = exercise.sets || 3;
  const completedSets = exercise.actual_sets || 0;
  const progressPercentage = Math.min((completedSets / totalSets) * 100, 100);

  const handleQuickComplete = async () => {
    if (isUpdating || exercise.completed) return;
    
    try {
      setIsUpdating(true);
      
      console.log('🎯 Quick completing exercise:', exercise.name);
      
      // First update progress to full completion
      await onProgressUpdate(
        exercise.id, 
        totalSets, 
        Array(totalSets).fill(exercise.reps || '12').join('-'),
        exercise.notes
      );
      
      // Then mark as completed
      await onComplete(exercise.id);
      
      console.log('✅ Exercise completed:', exercise.name);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVideoClick = () => {
    setShowVideoDialog(true);
  };

  const handleExchangeClick = () => {
    setShowExchangeDialog(true);
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
                <Badge className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('Completed')}
                </Badge>
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
          
          <div className="flex items-center gap-2">
            {/* Action Icons */}
            <ExerciseActionsMenu
              exercise={exercise}
              onShowVideo={handleVideoClick}
              onShowExchange={handleExchangeClick}
            />
            
            {/* Start/Active Button */}
            {!exercise.completed && onSetActive && (
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={onSetActive}
                disabled={isUpdating}
                className="h-8"
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
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{t('Progress')}</span>
            <span className="font-medium">
              {completedSets}/{totalSets} {t('sets')}
              {exercise.actual_reps && (
                <span className="text-gray-500 ml-1">
                  ({exercise.actual_reps.split('-').slice(0, completedSets).join(', ')} {t('reps')})
                </span>
              )}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Quick Complete Button - Only show for non-active, non-completed exercises */}
        {!isActive && !exercise.completed && (
          <Button
            onClick={handleQuickComplete}
            disabled={isUpdating}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isUpdating ? (
              <>
                <Timer className="w-4 h-4 mr-2 animate-spin" />
                {t('Updating...')}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('Mark as Complete')}
              </>
            )}
          </Button>
        )}

        {/* Exercise Instructions */}
        {exercise.instructions && (
          <div className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
            <strong>{t('Instructions')}:</strong> {exercise.instructions}
          </div>
        )}
      </Card>

      {/* Dialogs */}
      <ExerciseVideoDialog
        exercise={exercise}
        open={showVideoDialog}
        onOpenChange={setShowVideoDialog}
      />

      <ExerciseExchangeDialog
        exercise={exercise}
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
      />
    </>
  );
};
