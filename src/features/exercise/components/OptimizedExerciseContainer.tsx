
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Trophy, 
  Target, 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useOptimizedExercise } from '../hooks/useOptimizedExercise';
import { InteractiveExerciseCard } from './InteractiveExerciseCard';
import { AnimatedProgressRing } from './AnimatedProgressRing';

interface WeekDay {
  dayNumber: number;
  dayName: string;
  workout?: any;
  isRestDay: boolean;
  isCompleted: boolean;
  isToday: boolean;
}

const OptimizedExerciseContainer: React.FC = () => {
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
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    optimizedActions
  } = useOptimizedExercise();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Memoized calculations
  const todayProgress = useMemo(() => {
    if (!currentDayExercises.length) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = currentDayExercises.filter(ex => ex.completed).length;
    const total = currentDayExercises.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  }, [currentDayExercises]);

  // Loading states
  if (loadingStates.isProgramLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your exercise program...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (programError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to Load Program</h3>
          <p className="text-gray-600 mb-4">
            We couldn't load your exercise program. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // No program state
  if (!weeklyProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-gray-400 mb-4">
            <Target className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Exercise Program</h3>
          <p className="text-gray-600 mb-4">
            Create your first exercise program to get started with your fitness journey.
          </p>
          <Button onClick={() => {}}>
            Create Program
          </Button>
        </Card>
      </div>
    );
  }

  const handleDaySelect = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    setIsSessionActive(false);
    setCurrentExerciseIndex(0);
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentExerciseIndex(0);
    optimizedActions.startWorkout();
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < currentDayExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setIsSessionActive(false);
      optimizedActions.completeWorkout();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const currentExercise = currentDayExercises[currentExerciseIndex];
  const isRestDay = weekStructure.find(day => day.dayNumber === selectedDay)?.isRestDay || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {weeklyProgram.program_name}
            </h1>
            <p className="text-gray-600">
              Week {weeklyProgram.current_week} • {weeklyProgram.difficulty_level}
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {weeklyProgram.workout_type === 'gym' ? '🏋️ Gym' : '🏠 Home'}
          </Badge>
        </div>

        {/* Week Navigation */}
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekStructure.map((day: WeekDay) => (
              <Button
                key={day.dayNumber}
                variant={selectedDay === day.dayNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handleDaySelect(day.dayNumber)}
                className={`flex flex-col h-20 ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <span className="text-xs">{day.dayName.slice(0, 3)}</span>
                <span className="text-lg font-bold">{day.dayNumber}</span>
                {day.isRestDay ? (
                  <span className="text-xs text-gray-500">Rest</span>
                ) : day.isCompleted ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                )}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <AnimatedProgressRing
                  completedExercises={todayProgress.completed}
                  totalExercises={todayProgress.total}
                  progressPercentage={todayProgress.percentage}
                  isToday={weekStructure.find(d => d.dayNumber === selectedDay)?.isToday || false}
                  isRestDay={isRestDay}
                />
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {todayProgress.completed}/{todayProgress.total}
                  </div>
                  <div className="text-sm text-gray-600">Exercises Completed</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold">{progressMetrics.completedWorkouts}</div>
                    <div className="text-xs text-gray-600">Workouts</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold">{progressMetrics.progressPercentage}%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isRestDay ? (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">🛌</div>
                <h3 className="text-2xl font-semibold mb-2">Rest Day</h3>
                <p className="text-gray-600">
                  Take this time to recover and prepare for tomorrow's workout.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Session Controls */}
                {!isSessionActive ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentWorkout?.workout_name || `Day ${selectedDay} Workout`}
                        </h3>
                        <p className="text-gray-600">
                          {currentDayExercises.length} exercises • Est. {currentWorkout?.estimated_duration || 30} min
                        </p>
                      </div>
                      <Button onClick={handleStartSession} size="lg" className="flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Start Workout
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Active Session</h3>
                        <p className="text-gray-600">
                          Exercise {currentExerciseIndex + 1} of {currentDayExercises.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handlePreviousExercise}
                          disabled={currentExerciseIndex === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsSessionActive(false)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleNextExercise}
                        >
                          {currentExerciseIndex === currentDayExercises.length - 1 ? (
                            'Finish'
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4" />
                              Next
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {currentExercise && (
                      <InteractiveExerciseCard
                        exercise={currentExercise}
                        onComplete={() => handleExerciseComplete(currentExercise.id)}
                        onProgressUpdate={(sets, reps, notes) => 
                          handleExerciseProgressUpdate(currentExercise.id, sets, reps, notes)
                        }
                        isActive={true}
                      />
                    )}
                  </Card>
                )}

                {/* Exercise List */}
                {!isSessionActive && (
                  <div className="space-y-4">
                    {currentDayExercises.map((exercise, index) => (
                      <InteractiveExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onComplete={() => handleExerciseComplete(exercise.id)}
                        onProgressUpdate={(sets, reps, notes) => 
                          handleExerciseProgressUpdate(exercise.id, sets, reps, notes)
                        }
                        isActive={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedExerciseContainer;
