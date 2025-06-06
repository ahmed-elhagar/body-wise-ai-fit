
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

  // Create week structure that matches WeekDay interface
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekStructure = Array.from({ length: 7 }, (_, index) => ({
    dayNumber: index + 1,
    dayName: dayNames[index],
    isCompleted: index + 1 === selectedDayNumber ? progressPercentage === 100 : false,
    isRestDay: index + 1 === selectedDayNumber ? todaysExercises.length === 0 : false,
    isToday: index + 1 === selectedDayNumber
  }));

  // Create progress metrics that match ProgressMetrics interface
  const progressMetrics = {
    completedWorkouts: completedExercises > 0 ? 1 : 0,
    totalWorkouts: totalExercises > 0 ? 1 : 0,
    progressPercentage: progressPercentage
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
