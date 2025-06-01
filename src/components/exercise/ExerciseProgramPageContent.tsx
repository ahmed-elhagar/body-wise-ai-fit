import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramLoadingStates } from "./ExerciseProgramLoadingStates";
import { ExerciseProgramErrorState } from "./ExerciseProgramErrorState";
import { ExerciseProgramActions } from "./ExerciseProgramActions";
import { ExerciseProgramWeekNavigation } from "./ExerciseProgramWeekNavigation";
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
    data: exerciseProgramData,
    isLoading,
    isError,
    refetch: refetchExerciseProgram,
  } = useExerciseProgramQuery(programId || '', workoutType, selectedDay, weekStartDate);

  const {
    generateAIExercise,
    isGenerating,
    error: aiError,
  } = useAIExercise();

  const currentProgram = exerciseProgramData?.program;
  const currentWorkout = exerciseProgramData?.workout;
  const exercises = exerciseProgramData?.exercises || [];
  const isRestDay = exercises.length === 0;

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleShowAIDialog = () => setAIDialogOpen(true);
  const handleCloseAIDialog = () => setAIDialogOpen(false);

  const handleRegenerateProgram = async () => {
    if (!programId) return;
    await generateAIExercise(
      { programId: programId, workoutType: workoutType },
      { onSuccess: () => refetchExerciseProgram() }
    );
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
    if (!programId) return;
    
    try {
      // Optimistically update the UI
      const updatedExercises = exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );

      // Call the API to update the exercise completion status
      const { error } = await supabase
        .from('user_exercises')
        .update({ completed: !exercises.find(ex => ex.id === exerciseId)?.completed })
        .eq('id', exerciseId);

      if (error) {
        console.error("Error updating exercise completion:", error);
        // Revert the optimistic update if the API call fails
        // setExercises(prevExercises);
      } else {
        refetchExerciseProgram();
      }
    } catch (error) {
      console.error("Unexpected error updating exercise:", error);
      // Revert the optimistic update if an unexpected error occurs
      // setExercises(prevExercises);
    }
  };

  const handleExerciseProgressUpdate = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    if (!programId) return;

    try {
      // Call the API to update the exercise progress
      const { error } = await supabase
        .from('user_exercises')
        .update({ sets: sets, reps: reps, notes: notes, completed: true })
        .eq('id', exerciseId);

      if (error) {
        console.error("Error updating exercise progress:", error);
      } else {
        refetchExerciseProgram();
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

  if (isError || aiError) {
    return <ExerciseProgramErrorState onRetry={refetchExerciseProgram} />;
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
          exercises={exercises}
          isLoading={isLoading}
          onExerciseComplete={handleExerciseComplete}
          onExerciseProgressUpdate={handleOpenExerciseProgress}
          isRestDay={isRestDay}
        />
      </div>

      {/* Exercise Progress Dialog */}
      <ExerciseProgressDialog
        open={exerciseProgressOpen}
        onOpenChange={setExerciseProgressOpen}
        exercise={selectedExercise}
        onSave={handleExerciseProgressUpdate}
      />
    </div>
  );
};

export default ExerciseProgramPageContent;
