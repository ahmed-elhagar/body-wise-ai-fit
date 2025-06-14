
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Target, TrendingUp } from "lucide-react";
import { useOptimizedExercise } from "@/features/exercise/hooks";
import { WorkoutSession } from "@/types/exercise";

export const UnifiedExerciseContainer = () => {
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const { 
    currentProgram, 
    todayWorkout, 
    isLoading, 
    startSession 
  } = useOptimizedExercise();

  if (isLoading) {
    return <div className="p-4">Loading exercise data...</div>;
  }

  const handleStartSession = () => {
    if (todayWorkout?.exercises) {
      const newSession: WorkoutSession = {
        id: crypto.randomUUID(),
        name: `Workout - ${new Date().toLocaleDateString()}`,
        exercises: todayWorkout.exercises,
        started_at: new Date().toISOString(),
      };
      
      setActiveSession(newSession);
    }
  };

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      {currentProgram && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {currentProgram.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{currentProgram.description}</p>
            <div className="flex gap-2">
              <Badge variant="outline">
                {currentProgram.duration_weeks} weeks
              </Badge>
              <Badge variant="outline">
                {currentProgram.daily_workouts.length} workouts
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Workout */}
      {todayWorkout && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{todayWorkout.name || 'Daily Workout'}</h3>
                  <p className="text-sm text-gray-600">
                    {todayWorkout.exercises?.length || 0} exercises
                  </p>
                </div>
                <Button onClick={handleStartSession}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
              </div>
              
              {todayWorkout.exercises?.slice(0, 3).map((exercise) => (
                <div key={exercise.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    {exercise.weight && (
                      <Badge variant="outline">{exercise.weight}kg</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session */}
      {activeSession && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-600">Active Workout Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Started: {new Date(activeSession.started_at!).toLocaleTimeString()}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setActiveSession(null)}
              variant="outline"
            >
              End Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
