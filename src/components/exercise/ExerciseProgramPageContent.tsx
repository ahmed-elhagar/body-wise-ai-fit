import React, { useState, useEffect } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { Card } from "@/components/ui/card";
import { ExerciseHeader } from './ExerciseHeader';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { ExerciseProgramDaySelector } from './ExerciseProgramDaySelector';
import { ExerciseList } from './ExerciseList';
import { EmptyExerciseState } from './EmptyExerciseState';
import { ExerciseProgramErrorState } from './ExerciseProgramErrorState';
import { ExerciseProgramActions } from './ExerciseProgramActions';
import { AIExerciseDialog } from './AIExerciseDialog';
import { ExerciseListEnhanced } from './ExerciseListEnhanced';
import { ExerciseCompactNavigation } from './ExerciseCompactNavigation';
import { CompactWorkoutSummary } from './CompactWorkoutSummary';
import { ExerciseMotivationCard } from './ExerciseMotivationCard';
import { ExerciseProgramDayContent } from './ExerciseProgramDayContent';
import type { Exercise } from '@/types/exercise';
import { OptimizedExerciseList } from './OptimizedExerciseList';

interface ExerciseProgramPageContentProps {
  currentProgram: any;
  isLoading: boolean;
  isError: boolean;
  onGenerateProgram: () => void;
  onRegenerateProgram: () => void;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
}

const today = new Date();
const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));

const defaultAIPreferences = {
  goal: 'weight_loss',
  level: 'beginner',
  daysPerWeek: '3',
  duration: '30',
};

const ExerciseProgramPageContent = ({
  currentProgram,
  isLoading,
  isError,
  onGenerateProgram,
  onRegenerateProgram,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isGenerating
}: ExerciseProgramPageContentProps) => {
  const { t } = useI18n();
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 1);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPreferences, setAiPreferences] = useState(defaultAIPreferences);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const todaysWorkouts = currentProgram?.daily_workouts?.filter((workout: any) => workout.day_number === selectedDay) || [];
  const todaysExercises = todaysWorkouts.flatMap((workout: any) => workout.exercises) || [];
  const completedExercises = todaysExercises.filter((exercise: Exercise) => exercise.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const isRestDay = todaysWorkouts.some((workout: any) => workout.is_rest_day === true);

  const weekStartDate = new Date(startOfWeek);
  weekStartDate.setDate(weekStartDate.getDate() + (currentWeekOffset * 7));

  const handleShowAIDialog = () => {
    setShowAIDialog(true);
  };

  if (isError) {
    return <ExerciseProgramErrorState onRetry={onGenerateProgram} />;
  }

  return (
    <div className="space-y-6">
      {/* <ExerciseHeader
        selectedDay={selectedDay}
        workoutType={workoutType}
        currentProgram={currentProgram}
      /> */}

      {/* <WorkoutTypeSelector
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
      /> */}

      {/* <ExerciseProgramActions
        onShowAIDialog={handleShowAIDialog}
        onRegenerateProgram={onRegenerateProgram}
        isGenerating={isGenerating}
        workoutType={workoutType}
      /> */}

      <ExerciseCompactNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
        selectedDayNumber={selectedDay}
        setSelectedDayNumber={setSelectedDay}
        currentProgram={currentProgram}
        workoutType={workoutType}
      />

      {/* <ExerciseProgramDaySelector
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        weekStartDate={weekStartDate}
      /> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ExerciseMotivationCard
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            isRestDay={isRestDay}
          />
        </div>

        <div className="lg:col-span-3">
          <CompactWorkoutSummary
            todaysWorkouts={todaysWorkouts}
            currentProgram={currentProgram}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            workoutType={workoutType}
            selectedDay={selectedDay}
            isRestDay={isRestDay}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 animate-spin border-4 border-health-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-health-text-secondary text-lg font-medium">{t('exercise.loadingExercises')}</p>
        </div>
      ) : currentProgram ? (
        <OptimizedExerciseList
          exercises={todaysExercises}
          isLoading={isLoading}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />
      ) : (
        <EmptyExerciseState
          onGenerateProgram={onGenerateProgram}
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          showAIDialog={showAIDialog}
          setShowAIDialog={setShowAIDialog}
          aiPreferences={aiPreferences}
          setAiPreferences={setAiPreferences}
          isGenerating={isGenerating}
        />
      )}

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={(prefs) => {
          // This will be handled by the parent component
          setShowAIDialog(false);
        }}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ExerciseProgramPageContent;
