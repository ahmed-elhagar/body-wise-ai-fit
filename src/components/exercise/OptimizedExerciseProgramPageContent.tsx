
import React from 'react';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import { Exercise, DailyWorkout } from '@/types/exercise';
import ExerciseDaySelector from './ExerciseDaySelector';
import OptimizedExerciseDayView from './OptimizedExerciseDayView';
import ExercisePageHeader from './ExercisePageHeader';
import ModernProgressSidebar from './ModernProgressSidebar';

interface OptimizedExerciseProgramPageContentProps {
  exercises: Exercise[];
  dailyWorkout?: DailyWorkout;
  selectedDay: number;
  onDaySelect: (day: number) => void;
  workoutType: 'home' | 'gym';
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseStart: (exerciseId: string) => void;
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
  isGenerating?: boolean;
  currentWeek?: number;
  weeklyProgress?: number;
  personalRecords?: number;
  streak?: number;
}

const OptimizedExerciseProgramPageContent = ({
  exercises,
  dailyWorkout,
  selectedDay,
  onDaySelect,
  workoutType,
  onExerciseComplete,
  onExerciseStart,
  onRegenerateProgram,
  onCustomizeProgram,
  isGenerating = false,
  currentWeek = 1,
  weeklyProgress = 0,
  personalRecords = 0,
  streak = 0
}: OptimizedExerciseProgramPageContentProps) => {
  const { t, isRTL } = useI18n();

  const completedExercises = exercises.filter(ex => ex.completed).length;

  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <ExercisePageHeader
        title={t('exercise:exerciseProgram') || 'Exercise Program'}
        workoutType={workoutType}
        selectedDay={selectedDay}
        onRegenerateProgram={onRegenerateProgram}
        onCustomizeProgram={onCustomizeProgram}
        isGenerating={isGenerating}
      />

      <ExerciseDaySelector
        selectedDay={selectedDay}
        onDaySelect={onDaySelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <ModernProgressSidebar
            currentDay={selectedDay}
            completedExercises={completedExercises}
            totalExercises={exercises.length}
            weeklyProgress={weeklyProgress}
            personalRecords={personalRecords}
            streak={streak}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {dailyWorkout ? (
            <OptimizedExerciseDayView
              dailyWorkout={dailyWorkout}
              selectedDay={selectedDay}
              onExerciseComplete={onExerciseComplete}
              onExerciseStart={onExerciseStart}
              workoutType={workoutType}
            />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                {t('exercise:noWorkoutFound') || 'No workout found for this day'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedExerciseProgramPageContent;
