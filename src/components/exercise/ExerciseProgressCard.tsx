
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Plus, 
  Minus, 
  Timer, 
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';
import { ExerciseActionsMenu } from './ExerciseActionsMenu';
import { ExerciseVideoDialog } from './ExerciseVideoDialog';
import { ExerciseExchangeDialog } from './ExerciseExchangeDialog';

interface ExerciseProgressCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => void;
  isActive?: boolean;
  onSetActive?: () => void;
}

interface SetProgress {
  completed: boolean;
  reps: number;
  weight?: number;
  restTimer?: number;
}

export const ExerciseProgressCard = ({ 
  exercise, 
  onComplete, 
  onProgressUpdate, 
  isActive = false,
  onSetActive 
}: ExerciseProgressCardProps) => {
  const { t } = useLanguage();
  const [setsProgress, setSetsProgress] = useState<SetProgress[]>(
    Array(exercise.sets || 3).fill(null).map(() => ({
      completed: false,
      reps: parseInt(exercise.reps || '12'),
      weight: undefined
    }))
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(exercise.rest_seconds || 60);
  const [notes, setNotes] = useState(exercise.notes || '');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  const completedSets = setsProgress.filter(set => set.completed).length;
  const totalSets = exercise.sets || 3;
  const progressPercentage = (completedSets / totalSets) * 100;

  const handleSetComplete = (setIndex: number) => {
    const newProgress = [...setsProgress];
    newProgress[setIndex].completed = !newProgress[setIndex].completed;
    setSetsProgress(newProgress);

    // Auto-start rest timer if set is completed
    if (newProgress[setIndex].completed && setIndex < totalSets - 1) {
      setIsTimerRunning(true);
      startRestTimer();
    }

    // Update exercise progress
    const completedCount = newProgress.filter(set => set.completed).length;
    const avgWeight = newProgress
      .filter(set => set.weight)
      .reduce((sum, set) => sum + (set.weight || 0), 0) / 
      (newProgress.filter(set => set.weight).length || 1);

    onProgressUpdate(
      exercise.id, 
      completedCount, 
      newProgress.map(set => set.reps).join('-'),
      notes,
      avgWeight || undefined
    );

    // Mark exercise as complete if all sets are done
    if (completedCount === totalSets) {
      console.log('🏆 All sets completed, marking exercise as complete');
      handleExerciseComplete();
    }
  };

  const handleExerciseComplete = () => {
    try {
      console.log('✅ Marking exercise complete:', exercise.id);
      onComplete(exercise.id);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
    }
  };

  const startRestTimer = () => {
    const timer = setInterval(() => {
      setCurrentTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          setCurrentTimer(exercise.rest_seconds || 60);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateSetReps = (setIndex: number, change: number) => {
    const newProgress = [...setsProgress];
    newProgress[setIndex].reps = Math.max(1, newProgress[setIndex].reps + change);
    setSetsProgress(newProgress);
  };

  const updateSetWeight = (setIndex: number, weight: number) => {
    const newProgress = [...setsProgress];
    newProgress[setIndex].weight = weight;
    setSetsProgress(newProgress);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                <Badge variant="default" className="bg-green-600">
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

        {/* Quick Complete Button for non-active exercises */}
        {!isActive && !exercise.completed && (
          <div className="mb-4">
            <Button
              onClick={handleExerciseComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('Mark as Complete')}
            </Button>
          </div>
        )}

        {/* Sets Tracking - Only show when active */}
        {isActive && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{t('Sets')}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWeightInput(!showWeightInput)}
                className="text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {showWeightInput ? t('Hide Weight') : t('Add Weight')}
              </Button>
            </div>
            
            <div className="grid gap-2">
              {setsProgress.map((set, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    set.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <Button
                    variant={set.completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetComplete(index)}
                    className="w-8 h-8 p-0"
                  >
                    {set.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => updateSetReps(index, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {set.reps}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => updateSetReps(index, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-gray-500">{t('reps')}</span>
                  </div>

                  {showWeightInput && (
                    <div className="flex items-center gap-1 ml-2">
                      <Input
                        type="number"
                        placeholder="kg"
                        value={set.weight || ''}
                        onChange={(e) => updateSetWeight(index, parseFloat(e.target.value) || 0)}
                        className="w-16 h-6 text-xs"
                      />
                      <span className="text-xs text-gray-500">kg</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest Timer */}
        {isActive && isTimerRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{t('Rest Time')}</span>
              </div>
              <div className="text-lg font-bold text-blue-800">
                {formatTime(currentTimer)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsTimerRunning(false);
                setCurrentTimer(exercise.rest_seconds || 60);
              }}
              className="w-full mt-2 text-blue-600"
            >
              {t('Skip Rest')}
            </Button>
          </div>
        )}

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
