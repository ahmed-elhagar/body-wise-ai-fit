import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  CheckCircle,
  Timer,
  Target
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface SetProgress {
  completed: boolean;
  reps: number;
}

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onDeactivate: () => void;
}

export const ActiveExerciseTracker = ({
  exercise,
  onComplete,
  onProgressUpdate,
  onDeactivate
}: ActiveExerciseTrackerProps) => {
  const { t } = useLanguage();
  const [sets, setSets] = useState<SetProgress[]>([]);
  const [notes, setNotes] = useState(exercise.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSets, setCurrentSets] = useState(0);
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(undefined);

  const totalSets = exercise.sets || 3;
  const defaultReps = parseInt(exercise.reps || '12');
  const restSeconds = exercise.rest_seconds || 60;

  // Initialize sets from existing data or create new
  useEffect(() => {
    const initialSets: SetProgress[] = [];
    const existingActualSets = exercise.actual_sets || 0;
    const existingReps = exercise.actual_reps?.split('-').map(r => parseInt(r)) || [];

    for (let i = 0; i < totalSets; i++) {
      initialSets.push({
        completed: i < existingActualSets,
        reps: existingReps[i] || defaultReps
      });
    }
    setSets(initialSets);
  }, [totalSets, defaultReps, exercise.actual_sets, exercise.actual_reps]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleSetComplete = async (setIndex: number) => {
    if (isUpdating) return;

    const newSets = [...sets];
    const wasCompleted = newSets[setIndex].completed;
    newSets[setIndex].completed = !wasCompleted;
    setSets(newSets);

    // Start rest timer if set completed and not the last set
    if (!wasCompleted && setIndex < totalSets - 1) {
      setRestTimer(restSeconds);
      setIsResting(true);
    }

    // Update progress immediately
    const completedCount = newSets.filter(set => set.completed).length;
    const repsString = newSets.map(set => set.reps).join('-');

    console.log('🔄 Updating set progress:', { 
      setIndex: setIndex + 1, 
      completedCount, 
      repsString,
      exerciseName: exercise.name 
    });

    try {
      setIsUpdating(true);
      await onProgressUpdate(exercise.id, completedCount, repsString, notes);
      console.log('✅ Set progress updated:', { completedCount, repsString });
    } catch (error) {
      console.error('❌ Failed to update set progress:', error);
      // Revert on error
      newSets[setIndex].completed = wasCompleted;
      setSets(newSets);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSetReps = async (setIndex: number, change: number) => {
    const newSets = [...sets];
    const oldReps = newSets[setIndex].reps;
    newSets[setIndex].reps = Math.max(1, newSets[setIndex].reps + change);
    setSets(newSets);

    // Update reps string immediately
    const completedCount = newSets.filter(set => set.completed).length;
    const repsString = newSets.map(set => set.reps).join('-');

    console.log('🔢 Updating reps:', { 
      setIndex: setIndex + 1, 
      oldReps, 
      newReps: newSets[setIndex].reps,
      repsString 
    });

    try {
      await onProgressUpdate(exercise.id, completedCount, repsString, notes);
    } catch (error) {
      console.error('❌ Failed to update reps:', error);
      // Revert on error
      newSets[setIndex].reps = oldReps;
      setSets(newSets);
    }
  };

  const handleCompleteExercise = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      console.log('🏁 Completing entire exercise:', exercise.name);
      
      // First ensure all sets are marked complete
      const allSetsCompleted = sets.map(set => ({ ...set, completed: true }));
      const repsString = allSetsCompleted.map(set => set.reps).join('-');
      
      await onProgressUpdate(exercise.id, totalSets, repsString, notes);
      await onComplete(exercise.id);
      
      console.log('✅ Exercise fully completed:', exercise.name);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const completedSets = sets.filter(set => set.completed).length;
  const progressPercentage = (completedSets / totalSets) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRepsChange = (value: string) => {
    setCurrentReps(value);
  };

  const handleProgressUpdate = async () => {
    if (currentSets > 0) {
      await onProgressUpdate(
        exercise.id, 
        currentSets, 
        String(currentReps), // Ensure reps is always a string
        notes || undefined, 
        currentWeight || undefined
      );
    }
  };

  return (
    <Card className="p-4 ring-2 ring-blue-500 bg-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{totalSets} {t('sets')} × {exercise.reps} {t('reps')}</span>
            <Badge variant="outline">{completedSets}/{totalSets}</Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeactivate}
          disabled={isUpdating}
        >
          {t('Minimize')}
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">{t('Rest Time')}</span>
            </div>
            <div className="text-lg font-bold text-orange-800">
              {formatTime(restTimer)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsResting(false);
              setRestTimer(0);
            }}
            className="w-full mt-2 text-orange-600 hover:bg-orange-100"
          >
            {t('Skip Rest')}
          </Button>
        </div>
      )}

      {/* Sets Grid */}
      <div className="space-y-2 mb-4">
        {sets.map((set, index) => (
          <div 
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              set.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Button
              variant={set.completed ? "default" : "outline"}
              size="sm"
              onClick={() => handleSetComplete(index)}
              disabled={isUpdating}
              className={`w-10 h-10 p-0 ${
                set.completed ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {set.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </Button>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0"
                onClick={() => updateSetReps(index, -1)}
                disabled={isUpdating}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {set.reps}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0"
                onClick={() => updateSetReps(index, 1)}
                disabled={isUpdating}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <span className="text-xs text-gray-500 ml-1">{t('reps')}</span>
            </div>

            {set.completed && (
              <Badge className="ml-auto bg-green-600 text-xs">
                ✓ {t('Done')}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-4">
        <Input
          placeholder={t('Add notes about this exercise...')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-sm"
          disabled={isUpdating}
        />
      </div>

      {/* Complete Exercise Button */}
      <Button
        onClick={handleCompleteExercise}
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
            {t('Complete Exercise')}
          </>
        )}
      </Button>
    </Card>
  );
};

export default ActiveExerciseTracker;
