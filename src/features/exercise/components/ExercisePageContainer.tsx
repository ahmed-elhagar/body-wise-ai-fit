
import { useState } from "react";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useDailyWorkouts } from "@/hooks/useDailyWorkouts";
import { CompactExerciseHeader } from "./CompactExerciseHeader";
import { CompactExerciseNavigation } from "./CompactExerciseNavigation";
import { UnifiedExerciseContainer } from "./UnifiedExerciseContainer";
import { getWeekStartDate } from "@/utils/mealPlanUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import EnhancedSpinner from "@/components/ui/enhanced-spinner";

export const ExercisePageContainer = () => {
  const { t } = useLanguage();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDay() || 7);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");

  const { programs, isLoading: programsLoading, refetch: refetchPrograms } = useExercisePrograms();
  const currentProgram = programs?.[0];
  
  const { workouts, exercises, isLoading: workoutsLoading, refetch: refetchWorkouts } = useDailyWorkouts(
    currentProgram?.id, 
    selectedDayNumber, 
    workoutType
  );

  const weekStartDate = getWeekStartDate(currentWeekOffset);
  const isToday = currentWeekOffset === 0 && selectedDayNumber === (new Date().getDay() || 7);

  // Calculate progress
  const completedExercises = exercises?.filter(ex => ex.completed).length || 0;
  const totalExercises = exercises?.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Check if it's a rest day
  const todaysWorkout = workouts?.[0];
  const isRestDay = todaysWorkout?.workout_name?.toLowerCase().includes('rest') ||
                   (!exercises || exercises.length === 0);

  const handleExerciseComplete = async (exerciseId: string) => {
    console.log('Toggle exercise completion:', exerciseId);
    // TODO: Implement exercise completion logic
    await refetchWorkouts();
  };

  const handleExerciseProgressUpdate = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    console.log('Update exercise progress:', { exerciseId, sets, reps, notes });
    // TODO: Implement exercise progress update logic
    await refetchWorkouts();
  };

  const handleWeekChange = (newOffset: number) => {
    console.log('Week changed to offset:', newOffset);
    setCurrentWeekOffset(newOffset);
    refetchPrograms();
    refetchWorkouts();
  };

  const handleGenerateProgram = () => {
    console.log('Generate new program');
    // TODO: Implement AI program generation
  };

  const handleRegenerateProgram = () => {
    console.log('Regenerate program');
    // TODO: Implement program regeneration
  };

  const handleShowAnalytics = () => {
    console.log('Show analytics');
    // TODO: Implement analytics view
  };

  const handleShowSettings = () => {
    console.log('Show settings');
    // TODO: Implement settings view
  };

  if (programsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedSpinner size="lg" text={t('exercise.loadingProgram')} />
      </div>
    );
  }

  if (!currentProgram) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t('exercise.noProgramTitle') || 'No Exercise Program'}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('exercise.noProgramMessage') || 'You don\'t have an exercise program yet. Generate one to get started!'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 space-y-4">
        
        {/* Compact Header */}
        <CompactExerciseHeader 
          currentProgram={currentProgram}
          workoutType={workoutType}
          currentWeekOffset={currentWeekOffset}
          onGenerateProgram={handleGenerateProgram}
          onRegenerateProgram={handleRegenerateProgram}
          onShowAnalytics={handleShowAnalytics}
          onShowSettings={handleShowSettings}
        />

        {/* Compact Navigation */}
        <CompactExerciseNavigation
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={handleWeekChange}
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={setSelectedDayNumber}
          workoutType={workoutType}
          onWorkoutTypeChange={setWorkoutType}
          currentProgram={currentProgram}
        />

        {/* Exercise Content */}
        <UnifiedExerciseContainer
          exercises={exercises || []}
          isLoading={workoutsLoading}
          onExerciseComplete={handleExerciseComplete}
          onExerciseProgressUpdate={handleExerciseProgressUpdate}
          isRestDay={isRestDay}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          isToday={isToday}
          currentProgram={currentProgram}
          selectedDayNumber={selectedDayNumber}
        />

      </div>
    </div>
  );
};
