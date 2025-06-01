import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramLoadingStates } from "./ExerciseProgramLoadingStates";
import { ExerciseProgramErrorState } from "./ExerciseProgramErrorState";
import { ExerciseProgramActions } from "./ExerciseProgramActions";
import ExerciseProgramWeekNavigation from "./ExerciseProgramWeekNavigation";
import { WorkoutTypeSelector } from "./WorkoutTypeSelector";
import { ExerciseProgressDialog } from "./ExerciseProgressDialog";
import { useAIExercise } from "@/hooks/useAIExercise";
import { useExerciseProgramQuery } from "@/hooks/useExerciseProgramQuery";
import { useI18n } from "@/hooks/useI18n";
import { WorkoutSummaryCard } from "./WorkoutSummaryCard";
import { ExerciseProgressTracker } from "./ExerciseProgressTracker";
import { addDays, startOfWeek } from "date-fns";
import { OptimizedExerciseList } from "./OptimizedExerciseList";
import { WeeklyProgramOverview } from "./WeeklyProgramOverview";
import { supabase } from "@/integrations/supabase/client";

const ExerciseProgramPageContent = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isAIDialogOpen, setAIDialogOpen] = useState(false);
  const [exerciseProgressOpen, setExerciseProgressOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const weekStartDate = startOfWeek(addDays(new Date(), currentWeekOffset * 7), { weekStartsOn: 1 });

  const {
    program: currentProgram,
    workout: currentWorkout,
    exercises,
    isLoading,
    error,
    isRestDay,
    weekStartDate: queryWeekStartDate
  } = useExerciseProgramQuery(selectedDay, workoutType);

  const {
    generateAIExercise,
    isGenerating,
  } = useAIExercise();

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleShowAIDialog = () => setAIDialogOpen(true);
  const handleCloseAIDialog = () => setAIDialogOpen(false);

  const handleRegenerateProgram = async () => {
    await generateAIExercise({ 
      focus: 'general_fitness',
      equipment: workoutType === 'gym' ? 'full_gym' : 'bodyweight',
      duration: 45,
      intensity: 'medium',
      workoutType: workoutType 
    });
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(prev => Math.max(prev - 1, 0));
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const handleCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      const updatedExercises = exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );

      const { error } = await supabase
        .from('exercises')
        .update({ completed: !exercises.find(ex => ex.id === exerciseId)?.completed })
        .eq('id', exerciseId);

      if (error) {
        console.error("Error updating exercise completion:", error);
      }
    } catch (error) {
      console.error("Unexpected error updating exercise:", error);
    }
  };

  const handleExerciseProgressUpdate = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ sets: sets, reps: reps, notes: notes, completed: true })
        .eq('id', exerciseId);

      if (error) {
        console.error("Error updating exercise progress:", error);
      }
    } catch (error) {
      console.error("Unexpected error updating exercise progress:", error);
    } finally {
      setExerciseProgressOpen(false);
    }
  };

  const handleOpenExerciseProgress = (exercise: any) => {
    setSelectedExercise(exercise);
    setExerciseProgressOpen(true);
  };

  if (isLoading || isGenerating) {
    return <ExerciseProgramLoadingStates isLoading={isLoading} isGenerating={isGenerating} />;
  }

  if (error) {
    return <ExerciseProgramErrorState onRetry={handleRegenerateProgram} />;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row: Summary and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WorkoutSummaryCard 
              currentWorkout={currentWorkout}
              currentProgram={currentProgram}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              workoutType={workoutType}
            />
            <ExerciseProgramActions
              onShowAIDialog={handleShowAIDialog}
              onRegenerateProgram={handleRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
            />
          </div>
          <ExerciseProgressTracker
            currentProgram={currentProgram}
            selectedDay={selectedDay}
            currentWeekOffset={currentWeekOffset}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
          />
        </div>

        {/* Week Navigation and Workout Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExerciseProgramWeekNavigation
            currentWeekOffset={currentWeekOffset}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onCurrentWeek={handleCurrentWeek}
            weekStartDate={weekStartDate}
          />
          <WorkoutTypeSelector
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
          />
        </div>

        {/* Weekly Program Overview */}
        <WeeklyProgramOverview
          currentProgram={currentProgram}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          workoutType={workoutType}
        />

        {/* Exercise List */}
        <OptimizedExerciseList
          exercises={exercises.map(ex => ({ ...ex, daily_workout_id: currentWorkout?.id || '' }))}
          isLoading={isLoading}
          onExerciseComplete={handleExerciseComplete}
          onExerciseProgressUpdate={(exerciseId, sets, reps, notes) => {
            handleExerciseProgressUpdate(exerciseId, sets, reps, notes);
          }}
          isRestDay={isRestDay}
        />
      </div>

      {/* Exercise Progress Dialog */}
      <ExerciseProgressDialog
        open={exerciseProgressOpen}
        onOpenChange={setExerciseProgressOpen}
        exercise={selectedExercise}
        onSave={(sets, reps, notes) => {
          if (selectedExercise) {
            handleExerciseProgressUpdate(selectedExercise.id, sets, reps, notes);
          }
        }}
      />
    </div>
  );
};

export default ExerciseProgramPageContent;
