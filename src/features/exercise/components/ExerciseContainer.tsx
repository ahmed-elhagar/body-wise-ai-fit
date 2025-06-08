
import React from 'react';
import { useOptimizedExercise } from '@/hooks/useOptimizedExercise';
import { EnhancedPageLoading } from '@/components/ui/enhanced-page-loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const ExerciseContainer: React.FC = () => {
  const {
    currentProgram,
    weekStructure,
    currentWorkout,
    currentDayExercises,
    selectedDay,
    setSelectedDay,
    progressMetrics,
    loadingStates,
    programError,
    optimizedActions
  } = useOptimizedExercise();

  if (loadingStates.isProgramLoading) {
    return (
      <EnhancedPageLoading 
        message="Loading your exercise program..."
        progress={45}
        estimatedTime={3}
      />
    );
  }

  if (programError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load exercise program
          </h2>
          <p className="text-gray-600">{programError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Program Header */}
        {currentProgram && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentProgram.program_name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Difficulty: {currentProgram.difficulty_level}</span>
              <span>Type: {currentProgram.workout_type}</span>
              <span>Week: {currentProgram.current_week}</span>
            </div>
          </div>
        )}

        {/* Week Structure */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekStructure.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedDay === day.dayNumber
                  ? 'bg-primary text-primary-foreground border-primary'
                  : day.isToday
                  ? 'bg-accent border-accent-foreground/20'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium">{day.dayName}</div>
              {day.isRestDay ? (
                <div className="text-xs text-gray-500 mt-1">Rest Day</div>
              ) : (
                <div className="text-xs mt-1">
                  {day.workout?.exercises?.length || 0} exercises
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current Day Content */}
        {currentWorkout && !currentWorkout.is_rest_day && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentWorkout.workout_name}
            </h2>
            
            {/* Exercise List */}
            <div className="space-y-4">
              {currentDayExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                    <div className="text-sm text-gray-500">
                      {exercise.sets} sets × {exercise.reps} reps
                    </div>
                  </div>
                  
                  {exercise.instructions && (
                    <p className="text-sm text-gray-600 mb-2">
                      {exercise.instructions}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Rest: {exercise.rest_seconds}s
                    </div>
                    <button
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        exercise.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {exercise.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest Day Content */}
        {(!currentWorkout || currentWorkout.is_rest_day) && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Rest Day</h2>
            <p className="text-gray-600">
              Take a well-deserved break! Recovery is just as important as training.
            </p>
          </div>
        )}

        {/* Progress Metrics */}
        {progressMetrics && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progressMetrics.completedWorkouts}
                </div>
                <div className="text-sm text-gray-600">Completed Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progressMetrics.totalWorkouts}
                </div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progressMetrics.progressPercentage}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
