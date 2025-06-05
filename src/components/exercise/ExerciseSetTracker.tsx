
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  CheckCircle,
  Timer,
  Weight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SetProgress {
  completed: boolean;
  reps: number;
  weight?: number;
}

interface ExerciseSetTrackerProps {
  exerciseId: string;
  totalSets: number;
  defaultReps: number;
  restSeconds?: number;
  onSetComplete: (setIndex: number) => void;
  onProgressUpdate: (sets: number, reps: string, weight?: number) => Promise<void>;
  isActive: boolean;
  isUpdating: boolean;
  initialActualSets?: number;
  initialActualReps?: string;
}

export const ExerciseSetTracker = ({
  exerciseId,
  totalSets,
  defaultReps,
  restSeconds = 60,
  onSetComplete,
  onProgressUpdate,
  isActive,
  isUpdating,
  initialActualSets = 0,
  initialActualReps
}: ExerciseSetTrackerProps) => {
  const { t } = useLanguage();
  const [setsProgress, setSetsProgress] = useState<SetProgress[]>([]);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(restSeconds);

  // Initialize sets progress from existing data or create new
  useEffect(() => {
    const initializeSets = () => {
      const sets: SetProgress[] = [];
      
      if (initialActualReps && initialActualSets > 0) {
        // Parse existing reps data
        const repsArray = initialActualReps.split('-').map(r => parseInt(r) || defaultReps);
        
        for (let i = 0; i < totalSets; i++) {
          sets.push({
            completed: i < initialActualSets,
            reps: repsArray[i] || defaultReps,
            weight: undefined
          });
        }
      } else {
        // Create new sets
        for (let i = 0; i < totalSets; i++) {
          sets.push({
            completed: false,
            reps: defaultReps,
            weight: undefined
          });
        }
      }
      
      setSetsProgress(sets);
    };

    initializeSets();
  }, [totalSets, defaultReps, initialActualSets, initialActualReps]);

  const handleSetComplete = async (setIndex: number) => {
    if (isUpdating) return;
    
    const newProgress = [...setsProgress];
    const wasCompleted = newProgress[setIndex].completed;
    newProgress[setIndex].completed = !wasCompleted;
    setSetsProgress(newProgress);

    // Auto-start rest timer if set is completed and not the last set
    if (!wasCompleted && setIndex < totalSets - 1) {
      setIsTimerRunning(true);
      startRestTimer();
    }

    // Update progress
    const completedCount = newProgress.filter(set => set.completed).length;
    const repsString = newProgress.map(set => set.reps).join('-');
    
    // Calculate average weight if any sets have weight
    const setsWithWeight = newProgress.filter(set => set.weight && set.weight > 0);
    const avgWeight = setsWithWeight.length > 0 
      ? setsWithWeight.reduce((sum, set) => sum + (set.weight || 0), 0) / setsWithWeight.length
      : undefined;

    try {
      await onProgressUpdate(completedCount, repsString, avgWeight);
      onSetComplete(setIndex);
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Revert the state change if update failed
      const revertedProgress = [...setsProgress];
      revertedProgress[setIndex].completed = wasCompleted;
      setSetsProgress(revertedProgress);
    }
  };

  const startRestTimer = () => {
    let timeLeft = restSeconds;
    setCurrentTimer(timeLeft);
    
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCurrentTimer(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        setIsTimerRunning(false);
        setCurrentTimer(restSeconds);
      }
    }, 1000);
  };

  const updateSetReps = (setIndex: number, change: number) => {
    const newProgress = [...setsProgress];
    newProgress[setIndex].reps = Math.max(1, newProgress[setIndex].reps + change);
    setSetsProgress(newProgress);
  };

  const updateSetWeight = (setIndex: number, weight: number) => {
    const newProgress = [...setsProgress];
    newProgress[setIndex].weight = weight > 0 ? weight : undefined;
    setSetsProgress(newProgress);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSets = setsProgress.filter(set => set.completed).length;
  const progressPercentage = (completedSets / totalSets) * 100;

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Sets Header with Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-gray-900">{t('Sets')}</h4>
          <Badge variant="outline" className="text-xs">
            {completedSets}/{totalSets}
          </Badge>
          {progressPercentage > 0 && (
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWeightInput(!showWeightInput)}
          className="text-xs flex items-center gap-1"
        >
          <Weight className="w-3 h-3" />
          {showWeightInput ? t('Hide Weight') : t('Add Weight')}
        </Button>
      </div>
      
      {/* Sets Grid */}
      <div className="grid gap-2">
        {setsProgress.map((set, index) => (
          <div 
            key={index}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
              set.completed 
                ? 'bg-green-50 border-green-200 shadow-sm' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Button
              variant={set.completed ? "default" : "outline"}
              size="sm"
              onClick={() => handleSetComplete(index)}
              disabled={isUpdating}
              className={`w-10 h-10 p-0 transition-all duration-200 ${
                set.completed ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {set.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </Button>
            
            {/* Reps Control */}
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

            {/* Weight Input */}
            {showWeightInput && (
              <div className="flex items-center gap-1 ml-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={set.weight || ''}
                  onChange={(e) => updateSetWeight(index, parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-xs"
                  disabled={isUpdating}
                  min="0"
                  step="0.5"
                />
                <span className="text-xs text-gray-500">kg</span>
              </div>
            )}

            {/* Set Status */}
            {set.completed && (
              <Badge variant="default" className="ml-auto text-xs bg-green-600">
                ✓ Done
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Rest Timer */}
      {isTimerRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('Rest Time')}</span>
            </div>
            <div className="text-xl font-bold text-blue-800">
              {formatTime(currentTimer)}
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((restSeconds - currentTimer) / restSeconds) * 100}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsTimerRunning(false);
              setCurrentTimer(restSeconds);
            }}
            className="w-full text-blue-600 hover:bg-blue-100"
          >
            {t('Skip Rest')}
          </Button>
        </div>
      )}
    </div>
  );
};
