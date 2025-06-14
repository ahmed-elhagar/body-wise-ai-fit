
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { ActiveExerciseTracker } from './ActiveExerciseTracker';
import { WorkoutSessionManager } from './WorkoutSessionManager';
import { CustomExerciseDialog } from './CustomExerciseDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, 
  List, 
  Timer,
  Target,
  TrendingUp,
  Plus
} from 'lucide-react';

interface EnhancedExerciseListContainerProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
  isLoading?: boolean;
  completedExercises?: number;
  totalExercises?: number;
  progressPercentage?: number;
  isToday?: boolean;
  currentProgram?: any;
  selectedDayNumber?: number;
}

export const EnhancedExerciseListContainer = ({ 
  exercises, 
  onExerciseComplete, 
  onExerciseProgressUpdate,
  isRestDay = false,
  isLoading = false,
  completedExercises = 0,
  totalExercises = 0,
  progressPercentage = 0,
  isToday = false,
  currentProgram,
  selectedDayNumber = 1
}: EnhancedExerciseListContainerProps) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'session' | 'list'>('session');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);

  const dailyWorkoutId = currentProgram?.daily_workouts?.find(
    (workout: any) => workout.day_number === selectedDayNumber
  )?.id;

  if (isRestDay) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('Rest Day')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('Today is your rest day. Take time to recover and prepare for tomorrow\'s workout!')}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">💤</div>
              <div className="text-sm text-gray-600">{t('Rest')}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">🥗</div>
              <div className="text-sm text-gray-600">{t('Nutrition')}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">🧘</div>
              <div className="text-sm text-gray-600">{t('Recovery')}</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('No exercises for today')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('Check back later or generate a new workout program')}
        </p>
        
        {dailyWorkoutId && (
          <Button
            onClick={() => setShowCustomExerciseDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('Add Custom Exercise')}
          </Button>
        )}
      </Card>
    );
  }

  const handleSessionComplete = () => {
    console.log('🏆 Workout session completed!');
  };

  const handleSetActive = (exerciseId: string) => {
    setActiveExerciseId(current => current === exerciseId ? null : exerciseId);
  };

  const actualCompletedCount = exercises.filter(ex => ex.completed).length;
  const actualTotalCount = exercises.length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {t('Today\'s Workout')}
            </h2>
            <Badge variant="outline" className="text-sm">
              {actualCompletedCount}/{actualTotalCount} {t('completed')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {dailyWorkoutId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomExerciseDialog(true)}
                className="flex items-center gap-2 text-xs"
              >
                <Plus className="w-3 h-3" />
                {t('Add Exercise')}
              </Button>
            )}
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'session' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('session')}
                className="text-xs"
              >
                <Timer className="w-3 h-3 mr-1" />
                {t('Session')}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs"
              >
                <List className="w-3 h-3 mr-1" />
                {t('List')}
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'session' && (
          <>
            <WorkoutSessionManager
              exercises={exercises}
              onExerciseComplete={onExerciseComplete}
              onExerciseProgressUpdate={onExerciseProgressUpdate}
              onSessionComplete={handleSessionComplete}
            />
            
            {activeExerciseId && (
              <ActiveExerciseTracker
                exercise={exercises.find(ex => ex.id === activeExerciseId)!}
                onComplete={onExerciseComplete}
                onProgressUpdate={onExerciseProgressUpdate}
                onDeactivate={() => setActiveExerciseId(null)}
              />
            )}
            
            <div className="space-y-3">
              {exercises
                .filter(exercise => exercise.id !== activeExerciseId)
                .map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onComplete={onExerciseComplete}
                    onProgressUpdate={onExerciseProgressUpdate}
                    isActive={false}
                    onSetActive={() => handleSetActive(exercise.id)}
                  />
                ))}
            </div>
          </>
        )}

        {viewMode === 'list' && (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onComplete={onExerciseComplete}
                onProgressUpdate={onExerciseProgressUpdate}
                isActive={false}
                onSetActive={() => handleSetActive(exercise.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CustomExerciseDialog
        open={showCustomExerciseDialog}
        onOpenChange={setShowCustomExerciseDialog}
        dailyWorkoutId={dailyWorkoutId}
        onExerciseCreated={() => {
          window.location.reload();
        }}
      />
    </>
  );
};
