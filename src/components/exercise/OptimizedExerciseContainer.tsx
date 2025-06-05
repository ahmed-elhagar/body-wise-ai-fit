
import React from "react";
import { Card } from "@/components/ui/card";
import { useOptimizedExercise } from "@/hooks/useOptimizedExercise";
import OptimizedExerciseHeader from "./OptimizedExerciseHeader";
import OptimizedExerciseWeekView from "./OptimizedExerciseWeekView";
import OptimizedExerciseDayView from "./OptimizedExerciseDayView";
import OptimizedExerciseProgress from "./OptimizedExerciseProgress";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

const OptimizedExerciseContainer = React.memo(() => {
  const {
    weeklyProgram,
    weekStructure,
    currentWorkout,
    currentDayExercises,
    selectedDay,
    setSelectedDay,
    progressMetrics,
    loadingStates,
    programError,
    optimizedActions,
  } = useOptimizedExercise();

  if (loadingStates.isProgramLoading) {
    return (
      <Card className="p-8">
        <SimpleLoadingIndicator
          message="Loading exercise program..."
          description="Preparing your personalized workouts"
          size="lg"
        />
      </Card>
    );
  }

  if (programError) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Error Loading Exercise Program</h3>
          <p className="text-sm">{programError.message}</p>
        </div>
      </Card>
    );
  }

  if (!weeklyProgram) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">No Exercise Program Found</h3>
          <p className="text-sm">Create your first exercise program to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <OptimizedExerciseHeader 
        program={weeklyProgram}
        progressMetrics={progressMetrics}
        onGenerateNew={optimizedActions.startWorkout}
      />
      
      <OptimizedExerciseProgress 
        progressMetrics={progressMetrics}
        weekStructure={weekStructure}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OptimizedExerciseWeekView
            weekStructure={weekStructure}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        </div>
        
        <div className="lg:col-span-2">
          <OptimizedExerciseDayView
            currentWorkout={currentWorkout}
            exercises={currentDayExercises}
            selectedDay={selectedDay}
            onStartWorkout={optimizedActions.startWorkout}
            onCompleteWorkout={optimizedActions.completeWorkout}
            isLoading={loadingStates.isUpdating}
          />
        </div>
      </div>
    </div>
  );
});

OptimizedExerciseContainer.displayName = 'OptimizedExerciseContainer';

export default OptimizedExerciseContainer;
