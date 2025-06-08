
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { InteractiveExerciseCard } from './InteractiveExerciseCard';
import { RestDayCard } from './RestDayCard';
import { ExerciseEmptyState } from './ExerciseEmptyState';

interface ExerciseListEnhancedProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
  currentProgram?: any;
  selectedDayNumber?: number;
}

export const ExerciseListEnhanced = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  currentProgram,
  selectedDayNumber
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises.length) {
    return <ExerciseEmptyState />;
  }

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Workout Summary */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {t('exercise.todaysWorkout', 'Today\'s Workout')}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{totalCount} {t('exercise.exercises', 'exercises')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>~45 min</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-600">
              {completedCount}/{totalCount} {t('exercise.completed', 'completed')}
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            isActive={false}
          />
        ))}
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {t('exercise.workoutComplete', 'Workout Complete!')}
          </h3>
          <p className="text-green-700">
            {t('exercise.workoutCompleteMessage', 'Great job! You\'ve completed today\'s workout.')}
          </p>
        </Card>
      )}
    </div>
  );
};
