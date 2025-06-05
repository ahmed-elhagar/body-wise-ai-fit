
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  CheckCircle,
  Timer
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SetProgress {
  completed: boolean;
  reps: number;
  weight?: number;
  restTimer?: number;
}

interface ExerciseSetTrackerProps {
  exerciseId: string;
  totalSets: number;
  defaultReps: number;
  restSeconds?: number;
  onSetComplete: (setIndex: number) => void;
  onProgressUpdate: (sets: number, reps: string, weight?: number) => void;
  isActive: boolean;
  isUpdating: boolean;
}

export const ExerciseSetTracker = ({
  exerciseId,
  totalSets,
  defaultReps,
  restSeconds = 60,
  onSetComplete,
  onProgressUpdate,
  isActive,
  isUpdating
}: ExerciseSetTrackerProps) => {
  const { t } = useLanguage();
  const [setsProgress, setSetsProgress] = useState<SetProgress[]>(
    Array(totalSets).fill(null).map(() => ({
      completed: false,
      reps: defaultReps,
      weight: undefined
    }))
  );
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(restSeconds);

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
    const avgWeight = newProgress
      .filter(set => set.weight)
      .reduce((sum, set) => sum + (set.weight || 0), 0) / 
      (newProgress.filter(set => set.weight).length || 1);

    onProgressUpdate(
      completedCount, 
      newProgress.map(set => set.reps).join('-'),
      avgWeight || undefined
    );

    onSetComplete(setIndex);
  };

  const startRestTimer = () => {
    const timer = setInterval(() => {
      setCurrentTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          setCurrentTimer(restSeconds);
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

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Sets Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{t('Sets')}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWeightInput(!showWeightInput)}
          className="text-xs"
        >
          {showWeightInput ? t('Hide Weight') : t('Add Weight')}
        </Button>
      </div>
      
      {/* Sets Grid */}
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
              disabled={isUpdating}
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

      {/* Rest Timer */}
      {isTimerRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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
              setCurrentTimer(restSeconds);
            }}
            className="w-full mt-2 text-blue-600"
          >
            {t('Skip Rest')}
          </Button>
        </div>
      )}
    </div>
  );
};
