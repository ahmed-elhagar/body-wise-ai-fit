
import { useState } from "react";
import { useExercisePrograms } from "../hooks/useExercisePrograms";
import { useExerciseTracking } from "../hooks/useExerciseTracking";
import { useWorkoutGeneration } from "../hooks/useWorkoutGeneration";
import { ExercisePreferences } from "../types";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyProgramState from "./EmptyProgramState";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Building2, Plus } from "lucide-react";

export const ExercisePageContainer = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDay() || 7);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");

  const { data: programs, isLoading, error, refetch } = useExercisePrograms(currentWeekOffset);
  const { startWorkout, completeWorkout, isTracking } = useExerciseTracking();
  const { generateWorkoutPlan, isGenerating } = useWorkoutGeneration();

  const currentProgram = programs?.weeklyProgram;
  const todaysWorkouts = programs?.dailyWorkouts?.filter(
    workout => workout.day_number === selectedDayNumber
  ) || [];

  // Create mock exercises from workouts since exercises property doesn't exist
  const todaysExercises = todaysWorkouts.map(workout => ({
    id: workout.id,
    name: workout.workout_name,
    daily_workout_id: workout.id,
    sets: 3,
    reps: '12',
    completed: workout.completed || false,
    muscle_groups: workout.target_muscle_groups || [],
    estimated_duration: workout.estimated_duration,
    created_at: workout.created_at,
    updated_at: workout.updated_at
  }));

  const isRestDay = todaysWorkouts.length === 0 || 
    todaysWorkouts.every(w => w.workout_name?.toLowerCase().includes('rest'));

  const handleExerciseComplete = async (exerciseId: string) => {
    console.log('Completing exercise:', exerciseId);
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    console.log('Updating exercise progress:', { exerciseId, sets, reps, notes, weight });
  };

  const handleGenerateProgram = async () => {
    const preferences: ExercisePreferences = {
      workoutType: workoutType,
      difficultyLevel: 'beginner',
      targetMuscleGroups: ['full_body'],
      workoutDuration: 45,
      fitnessGoals: ['general_fitness']
    };
    
    const success = await generateWorkoutPlan(preferences);
    if (success) {
      refetch();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  if (!currentProgram) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-fitness-primary-600 to-fitness-primary-700 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Exercise Program</h1>
                  <p className="text-fitness-primary-100 text-sm">Create your workout plan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkoutType('home')}
                  className={`border-white/20 text-white hover:bg-white/10 ${
                    workoutType === 'home' ? 'bg-white/20' : ''
                  }`}
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkoutType('gym')}
                  className={`border-white/20 text-white hover:bg-white/10 ${
                    workoutType === 'gym' ? 'bg-white/20' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  Gym
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <EmptyProgramState onGenerateProgram={handleGenerateProgram} isGenerating={isGenerating} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-600 to-fitness-primary-700 border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{currentProgram.program_name}</h1>
                <p className="text-fitness-primary-100 text-sm">
                  Week {currentProgram.current_week} • {currentProgram.difficulty_level}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWorkoutType('home')}
                className={`border-white/20 text-white hover:bg-white/10 ${
                  workoutType === 'home' ? 'bg-white/20' : ''
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWorkoutType('gym')}
                className={`border-white/20 text-white hover:bg-white/10 ${
                  workoutType === 'gym' ? 'bg-white/20' : ''
                }`}
              >
                <Building2 className="w-4 h-4 mr-1" />
                Gym
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Day Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Select Day</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateProgram}
            disabled={isGenerating}
          >
            <Plus className="w-4 h-4 mr-1" />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const hasWorkout = programs?.dailyWorkouts?.some(w => w.day_number === dayNumber && !w.workout_name?.toLowerCase().includes('rest'));
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDayNumber(dayNumber)}
                className={`relative ${isSelected ? 'bg-fitness-primary-500 text-white' : ''}`}
              >
                {day}
                {hasWorkout && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Exercise Content */}
      <ExerciseListEnhanced
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        isRestDay={isRestDay}
        currentProgram={currentProgram}
        selectedDayNumber={selectedDayNumber}
      />
    </div>
  );
};
