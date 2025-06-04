
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';
import { ExerciseProgressCard } from './ExerciseProgressCard';
import { WorkoutSessionManager } from './WorkoutSessionManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, 
  List, 
  Timer,
  Target,
  TrendingUp 
} from 'lucide-react';

interface EnhancedExerciseListContainerProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => void;
  isRestDay?: boolean;
  // Optional props that might be passed from parent
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
        <p className="text-gray-600">
          {t('Check back later or generate a new workout program')}
        </p>
      </Card>
    );
  }

  const handleSessionComplete = () => {
    console.log('🏆 Workout session completed!');
    // You can add additional logic here like tracking workout completion
  };

  const actualCompletedCount = exercises.filter(ex => ex.completed).length;
  const actualTotalCount = exercises.length;

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t('Today\'s Workout')}
          </h2>
          <Badge variant="outline" className="text-sm">
            {actualCompletedCount}/{actualTotalCount} {t('completed')}
          </Badge>
        </div>
        
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

      {/* Session Mode */}
      {viewMode === 'session' && (
        <>
          <WorkoutSessionManager
            exercises={exercises}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            onSessionComplete={handleSessionComplete}
          />
          
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseProgressCard
                key={exercise.id}
                exercise={exercise}
                onComplete={onExerciseComplete}
                onProgressUpdate={onExerciseProgressUpdate}
                isActive={activeExerciseId === exercise.id}
                onSetActive={() => setActiveExerciseId(
                  activeExerciseId === exercise.id ? null : exercise.id
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* List Mode - Simple view */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {exercise.sets} {t('sets')} × {exercise.reps} {t('reps')}
                    {exercise.equipment && (
                      <span className="ml-2 text-blue-600">• {exercise.equipment}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant={exercise.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => onExerciseComplete(exercise.id)}
                >
                  {exercise.completed ? t('Completed') : t('Mark Complete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
