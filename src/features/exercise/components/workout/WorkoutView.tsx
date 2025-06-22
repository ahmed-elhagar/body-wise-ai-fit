
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, CheckCircle, Clock, Target } from 'lucide-react';
import { ExerciseProgram, Exercise } from '../../types';
import { WorkoutTypeSelector } from '../shared/WorkoutTypeSelector';

interface WorkoutViewProps {
  currentProgram?: ExerciseProgram;
  todaysExercises: Exercise[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  workoutTimer: number;
  isTimerRunning: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  hasProgram: boolean;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  workoutType,
  setWorkoutType,
  workoutTimer,
  isTimerRunning,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onStartWorkout,
  onPauseWorkout,
  hasProgram
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasProgram) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Workout Program</h3>
        <p className="text-gray-600">Generate an AI workout program to get started!</p>
      </div>
    );
  }

  if (isRestDay) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Rest Day</h3>
        <p className="text-gray-600">Take a well-deserved break and let your muscles recover!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Workout
            </CardTitle>
            <div className="flex items-center gap-2">
              {workoutTimer > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(workoutTimer)}
                </Badge>
              )}
              <Button
                onClick={isTimerRunning ? onPauseWorkout : onStartWorkout}
                size="sm"
                variant={isTimerRunning ? "destructive" : "default"}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{completedExercises}/{totalExercises} exercises</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Workout Type Selector */}
      <WorkoutTypeSelector
        selectedType={workoutType}
        onTypeChange={setWorkoutType}
      />

      {/* Exercise List */}
      <div className="space-y-4">
        {todaysExercises.map((exercise, index) => (
          <Card key={exercise.id} className={`${exercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{exercise.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{exercise.sets} sets</span>
                    <span>{exercise.reps} reps</span>
                    <span>{exercise.rest_seconds}s rest</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {exercise.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Badge variant={exercise.completed ? "default" : "outline"}>
                    {exercise.completed ? "Complete" : "Pending"}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{exercise.instructions}</p>

              <div className="flex items-center gap-2">
                {exercise.muscle_groups.map((group, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {group}
                  </Badge>
                ))}
              </div>

              {!exercise.completed && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={() => onExerciseComplete(exercise.id)}
                    className="w-full"
                    size="sm"
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
