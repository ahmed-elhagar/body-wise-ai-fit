
import React from "react";
import { Card } from "@/components/ui/card";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import OptimizedExerciseHeader from "./OptimizedExerciseHeader";
import OptimizedExerciseWeekView from "./OptimizedExerciseWeekView";
import OptimizedExerciseDayView from "./OptimizedExerciseDayView";
import OptimizedExerciseProgress from "./OptimizedExerciseProgress";
import ExerciseAILoadingDialog from "./ExerciseAILoadingDialog";

const OptimizedExerciseContainer = React.memo(() => {
  const {
    currentProgram,
    todaysWorkouts,
    todaysExercises,
    selectedDayNumber,
    setSelectedDayNumber,
    completedExercises,
    totalExercises,
    progressPercentage,
    isLoading,
    error,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
  } = useExerciseProgramPage();

  if (isLoading) {
    return (
      <>
        <Card className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Loading Exercise Program</h3>
            <p className="text-sm text-gray-600">Preparing your personalized workouts...</p>
          </div>
        </Card>
        <ExerciseAILoadingDialog 
          isGenerating={isLoading}
          type="program"
        />
      </>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Error Loading Exercise Program</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!currentProgram) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">No Exercise Program Found</h3>
          <p className="text-sm">Create your first exercise program to get started</p>
        </div>
      </Card>
    );
  }

  // Mock week structure based on current program
  const weekStructure = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    workout: todaysWorkouts[0] || null,
    exercises: index + 1 === selectedDayNumber ? todaysExercises : []
  }));

  const progressMetrics = {
    completedExercises,
    totalExercises,
    progressPercentage,
    currentWeek: currentProgram.current_week || 1
  };

  return (
    <>
      <div className="space-y-6">
        <OptimizedExerciseHeader 
          program={currentProgram}
          progressMetrics={progressMetrics}
          onGenerateNew={() => console.log('Generate new program')}
        />
        
        <OptimizedExerciseProgress 
          progressMetrics={progressMetrics}
          weekStructure={weekStructure}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <OptimizedExerciseWeekView
              weekStructure={weekStructure}
              selectedDay={selectedDayNumber}
              onDaySelect={setSelectedDayNumber}
            />
          </div>
          
          <div className="lg:col-span-2">
            <OptimizedExerciseDayView
              currentWorkout={todaysWorkouts[0] || null}
              exercises={todaysExercises}
              selectedDay={selectedDayNumber}
              onStartWorkout={() => console.log('Start workout')}
              onCompleteWorkout={() => console.log('Complete workout')}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* AI Loading Dialog for exercise exchanges */}
      <ExerciseAILoadingDialog 
        isGenerating={isLoading}
        type="exchange"
      />
    </>
  );
});

OptimizedExerciseContainer.displayName = 'OptimizedExerciseContainer';

export default OptimizedExerciseContainer;
