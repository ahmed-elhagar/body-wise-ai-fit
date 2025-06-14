
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, Calendar, Target, Zap, Timer } from "lucide-react";
import { useOptimizedExercise } from "@/features/exercise/hooks/useOptimizedExercise";

export const FitnessProgressSection = () => {
  const { 
    currentProgram, 
    progressMetrics, 
    loadingStates, 
    programError, 
    weekStructure 
  } = useOptimizedExercise();

  if (loadingStates.isProgramLoading) {
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

  if (programError) {
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
            <p className="text-red-600">Error loading fitness data: {programError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedWorkouts = progressMetrics?.completedWorkouts || 0;
  const totalWorkouts = progressMetrics?.totalWorkouts || 0;
  const weeklyProgress = progressMetrics?.weeklyProgress || 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Program</p>
                <p className="text-xl font-bold text-blue-900 truncate">
                  {currentProgram?.program_name || 'No Active Program'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {currentProgram?.difficulty_level || 'N/A'} • {currentProgram?.workout_type || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Workouts Complete</p>
                <p className="text-xl font-bold text-green-900">
                  {completedWorkouts}/{totalWorkouts}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round(weeklyProgress)}% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Current Streak</p>
                <p className="text-xl font-bold text-purple-900">
                  {progressMetrics?.currentStreak || 0} days
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Keep it up!
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Calories Burned</p>
                <p className="text-xl font-bold text-orange-900">
                  {progressMetrics?.totalCaloriesBurned || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  This week
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Weekly Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-500">{completedWorkouts} / {totalWorkouts}</span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Program Started</span>
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

      {/* Weekly Schedule */}
      {weekStructure && weekStructure.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {weekStructure.slice(0, 7).map((day) => (
                <div 
                  key={day.dayNumber} 
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    day.isCompleted 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : day.isToday 
                        ? 'bg-blue-50 border-blue-200 shadow-md' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-800">{day.dayName}</h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      day.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : day.isToday 
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {day.isCompleted ? '✓' : day.dayNumber}
                    </div>
                  </div>
                  {day.isRestDay ? (
                    <p className="text-xs text-gray-600">Rest Day</p>
                  ) : (
                    <p className="text-xs text-gray-600">
                      {day.workout?.workout_name || 'Workout scheduled'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!currentProgram && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Exercise Program</h3>
            <p className="text-gray-600 mb-4">Create your first exercise program to start tracking your fitness progress.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
