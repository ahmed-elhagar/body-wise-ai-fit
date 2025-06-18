
import React, { useState } from 'react';
import { useExercisePrograms } from '../hooks/useExercisePrograms';
import { useWorkoutGeneration } from '../hooks/useWorkoutGeneration';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus, Calendar } from 'lucide-react';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyProgramState from './EmptyProgramState';

const ExerciseContainer = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const { data: exerciseData, isLoading, error, refetch } = useExercisePrograms(currentWeekOffset);
  const { generateWorkoutPlan, isGenerating } = useWorkoutGeneration();

  const handleGenerateProgram = async () => {
    const defaultPreferences = {
      programType: 'mixed' as const,
      difficultyLevel: 'intermediate' as const,
      workoutsPerWeek: 4,
      sessionDuration: 45,
      targetMuscleGroups: ['chest', 'back', 'legs', 'shoulders'],
      availableEquipment: ['dumbbells', 'bodyweight'],
      workoutLocation: 'gym' as const
    };

    const success = await generateWorkoutPlan(defaultPreferences);
    if (success) {
      refetch();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!exerciseData?.weeklyProgram) {
    return (
      <EmptyProgramState 
        onGenerateProgram={handleGenerateProgram}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white mb-0.5 tracking-tight">
                  Exercise Program
                </h1>
                <p className="text-fitness-primary-100 text-sm font-medium">
                  {exerciseData.weeklyProgram.program_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerateProgram}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 h-10 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Program
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Program Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-fitness-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-fitness-primary-600">
              {exerciseData.weeklyProgram.total_workouts}
            </div>
            <div className="text-sm text-fitness-primary-600">Workouts/Week</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {exerciseData.weeklyProgram.estimated_weekly_hours}h
            </div>
            <div className="text-sm text-blue-600">Weekly Hours</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 capitalize">
              {exerciseData.weeklyProgram.difficulty_level}
            </div>
            <div className="text-sm text-purple-600">Difficulty</div>
          </div>
        </div>

        {/* Daily Workouts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Schedule
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {exerciseData.dailyWorkouts.map((workout) => (
              <Card key={workout.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Day {workout.day_number}: {workout.workout_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {workout.target_muscle_groups.join(', ')} • {workout.estimated_duration} min
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Start Workout
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExerciseContainer;
