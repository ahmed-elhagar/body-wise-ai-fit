
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, Calendar, Target } from "lucide-react";
import { useOptimizedExercise } from "@/features/exercise/hooks/useOptimizedExercise";

export const FitnessProgressSection = () => {
  const { currentProgram, weeklyWorkouts, isLoading, error } = useOptimizedExercise();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Fitness Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading fitness data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedWorkouts = weeklyWorkouts?.filter(workout => workout.completed)?.length || 0;
  const totalWorkouts = weeklyWorkouts?.length || 0;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Current Program</p>
                <p className="text-xl font-bold text-blue-900">
                  {currentProgram?.program_name || 'No Active Program'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {currentProgram?.difficulty_level || 'N/A'} • {currentProgram?.workout_type || 'N/A'}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Workouts Completed</p>
                <p className="text-xl font-bold text-green-900">
                  {completedWorkouts}/{totalWorkouts}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round(completionRate)}% completion rate
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Current Week</p>
                <p className="text-xl font-bold text-purple-900">
                  Week {currentProgram?.current_week || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {currentProgram?.week_start_date ? 
                    new Date(currentProgram.week_start_date).toLocaleDateString() : 
                    'No program active'
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-500">{completedWorkouts} / {totalWorkouts}</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Started Program</span>
              <span>
                <Calendar className="w-3 h-3 inline-block mr-1 align-text-bottom" />
                {currentProgram?.created_at ? 
                  new Date(currentProgram.created_at).toLocaleDateString() : 
                  'No program'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {weeklyWorkouts && weeklyWorkouts.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>This Week's Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyWorkouts.map((workout, index) => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      workout.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{workout.workout_name}</h4>
                      <p className="text-sm text-gray-600">
                        {workout.estimated_duration ? `${workout.estimated_duration} min` : 'Duration not set'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {workout.completed ? (
                      <span className="text-green-600 text-sm font-medium">Completed</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
