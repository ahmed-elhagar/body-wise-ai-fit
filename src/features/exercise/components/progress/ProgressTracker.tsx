
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { ExerciseProgram } from '../../types';

interface ProgressTrackerProps {
  currentProgram?: ExerciseProgram;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutTimer: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutTimer
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Exercise Completion</span>
                <span className="text-sm text-gray-600">{completedExercises}/{totalExercises}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            {workoutTimer > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Workout Time: {formatTime(workoutTimer)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentProgram?.daily_workouts ? (
            <div className="grid grid-cols-7 gap-2">
              {currentProgram.daily_workouts.map((workout, index) => (
                <div
                  key={workout.id}
                  className={`p-3 rounded-lg text-center ${
                    workout.completed
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className="text-xs font-medium mb-1">
                    Day {workout.day_number}
                  </div>
                  <div className="text-xs truncate">
                    {workout.workout_name}
                  </div>
                  {workout.completed && (
                    <div className="text-xs mt-1">✓</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No program data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {currentProgram?.total_estimated_calories || 0}
            </div>
            <div className="text-sm text-gray-600">Est. Calories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {currentProgram?.daily_workouts?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Workouts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {currentProgram?.current_week || 0}
            </div>
            <div className="text-sm text-gray-600">Current Week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
