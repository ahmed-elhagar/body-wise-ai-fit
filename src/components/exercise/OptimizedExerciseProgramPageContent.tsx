import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Home, Building2 } from "lucide-react";
import { WorkoutTypeToggle } from './WorkoutTypeToggle';
import { ExerciseProgramLoadingStates } from './ExerciseProgramLoadingStates';
import { ExerciseProgramErrorState } from './ExerciseProgramErrorState';
import OptimizedExerciseList from './OptimizedExerciseList';
import { ExerciseProgressDialog } from './ExerciseProgressDialog';
import { useAIExercise } from "@/hooks/useAIExercise";
import { useExerciseProgramQuery } from "@/hooks/useExerciseProgramQuery";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ExerciseProgramActions } from './ExerciseProgramActions';
import ExerciseProgramDaySelector from './ExerciseProgramDaySelector';
import { addDays, startOfWeek } from 'date-fns';
import { ExerciseProgramWeekNavigation } from './ExerciseProgramWeekNavigation';
import { WeeklyProgramOverview } from './WeeklyProgramOverview';
import { ProgramTypeIndicator } from './ProgramTypeIndicator';
import { useI18n } from "@/hooks/useI18n";

const OptimizedExerciseProgramPageContent = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useI18n();
  
  const [workoutType, setWorkoutType] = useState<"home" | "gym">(profile?.preferred_workout_environment === 'gym' ? "gym" : "home");
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(parseInt(day || '0') || new Date().getDay());
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [exerciseProgressOpen, setExerciseProgressOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const weekStartDate = startOfWeek(addDays(new Date(), currentWeekOffset * 7), { weekStartsOn: 1 });

  useEffect(() => {
    if (profile?.preferred_workout_environment) {
      setWorkoutType(profile.preferred_workout_environment === 'gym' ? "gym" : "home");
    }
  }, [profile?.preferred_workout_environment]);

  useEffect(() => {
    const dayNumber = parseInt(day || '0');
    if (!isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 7) {
      setSelectedDay(dayNumber);
    } else {
      setSelectedDay(new Date().getDay());
    }
  }, [day]);

  const { 
    data: currentProgram,
    isLoading,
    error,
    refetch
  } = useExerciseProgramQuery(user?.id, workoutType, selectedDay, weekStartDate);

  const {
    generateAIProgram,
    isGenerating,
  } = useAIExercise(user?.id, workoutType, selectedDay, currentProgram?.id, weekStartDate);

  const handleShowAIDialog = () => {
    setIsAIDialogOpen(true);
  };

  const handleCloseAIDialog = () => {
    setIsAIDialogOpen(false);
  };

  const handleRegenerateProgram = async () => {
    await generateAIProgram();
    await refetch();
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    navigate(`/exercise/${day}`);
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
    if (!currentProgram?.id) return;

    const updatedExercises = currentProgram.exercises.map((ex: any) => {
      if (ex.id === exerciseId) {
        return { ...ex, completed: !ex.completed };
      }
      return ex;
    });

    const { error } = await supabase
      .from('exercise_programs')
      .update({ exercises: updatedExercises })
      .eq('id', currentProgram.id);

    if (error) {
      console.error("Error updating exercise program:", error);
    } else {
      await refetch();
    }
  };

  const handleExerciseProgressUpdate = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    if (!currentProgram?.id) return;

    const updatedExercises = currentProgram.exercises.map((ex: any) => {
      if (ex.id === exerciseId) {
        return { ...ex, sets, reps, notes };
      }
      return ex;
    });

    const { error } = await supabase
      .from('exercise_programs')
      .update({ exercises: updatedExercises })
      .eq('id', currentProgram.id);

    if (error) {
      console.error("Error updating exercise program:", error);
    } else {
      await refetch();
    }
    setExerciseProgressOpen(false);
  };

  const handleOpenExerciseProgress = (exercise: any) => {
    setSelectedExercise(exercise);
    setExerciseProgressOpen(true);
  };

  const isRestDay = selectedDay === 7;
  const completedExercises = currentProgram?.exercises?.filter((ex: any) => ex.completed).length || 0;
  const totalExercises = currentProgram?.exercises?.length || 0;

  return (
    <div className="p-6">
      <ExerciseProgramLoadingStates isLoading={isLoading} isGenerating={isGenerating} />

      {error && (
        <ExerciseProgramErrorState onRetry={refetch} />
      )}

      {currentProgram && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Actions and Type Toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <ExerciseProgramActions
              onShowAIDialog={handleShowAIDialog}
              onRegenerateProgram={handleRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
            />
            <WorkoutTypeToggle
              workoutType={workoutType}
              onWorkoutTypeChange={(type) => {
                setWorkoutType(type);
                refetch();
              }}
            />
          </div>

          {/* Week Navigation */}
          <ExerciseProgramWeekNavigation
            currentWeekOffset={currentWeekOffset}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onCurrentWeek={handleCurrentWeek}
            weekStartDate={weekStartDate}
          />

          {/* Day Selector */}
          <ExerciseProgramDaySelector
            selectedDay={selectedDay}
            onDaySelect={handleDaySelect}
            weekStartDate={weekStartDate}
          />

          {/* Weekly Overview */}
          <WeeklyProgramOverview
            currentProgram={currentProgram}
            selectedDay={selectedDay}
            onDaySelect={handleDaySelect}
            workoutType={workoutType}
          />

          {/* Exercise List */}
          <OptimizedExerciseList
            exercises={currentProgram.exercises}
            isLoading={isLoading}
            onExerciseComplete={handleExerciseComplete}
            onExerciseProgressUpdate={handleExerciseProgressUpdate}
            isRestDay={isRestDay}
          />
        </div>
      )}

      {selectedExercise && (
        <ExerciseProgressDialog
          open={exerciseProgressOpen}
          onOpenChange={setExerciseProgressOpen}
          exercise={selectedExercise}
          onSave={handleExerciseProgressUpdate}
        />
      )}
    </div>
  );
};

export default OptimizedExerciseProgramPageContent;
