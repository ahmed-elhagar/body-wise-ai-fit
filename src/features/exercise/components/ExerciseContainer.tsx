import { useState } from "react";
import { useExercisePrograms } from "../hooks/useExercisePrograms";
import { useWorkoutGeneration } from "../hooks/useWorkoutGeneration";
import { ExercisePreferences } from "../types";

interface ExerciseContainerProps {
  // Component props
}

export const ExerciseContainer = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");

  const { data: programs, isLoading, error, refetch } = useExercisePrograms(currentWeekOffset);
  const { generateWorkoutPlan, isGenerating } = useWorkoutGeneration();

  const handleGenerateProgram = async () => {
    const preferences: ExercisePreferences = {
      workoutType: workoutType,
      difficultyLevel: 'intermediate',
      targetMuscleGroups: ['full_body'],
      workoutDuration: 45,
      fitnessGoals: ['general_fitness']
    };
    
    const success = await generateWorkoutPlan(preferences);
    if (success) {
      refetch();
    }
  };

  const currentProgram = programs?.weeklyProgram;
  const todaysWorkouts = programs?.dailyWorkouts?.filter(
    workout => workout.day_number === 1 // Default to Monday
  ) || [];

  const todaysExercises = todaysWorkouts.flatMap(workout => 
    workout.exercises?.map(ex => ex.exercise) || []
  );

  const isRestDay = todaysWorkouts.length === 0 || 
    todaysWorkouts.every(w => w.workout_name?.toLowerCase().includes('rest'));

  const handleExerciseComplete = async (exerciseId: string) => {
    console.log('Completing exercise:', exerciseId);
    // This would integrate with the exercise tracking system
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    console.log('Updating exercise progress:', { exerciseId, sets, reps, notes, weight });
    // This would integrate with the exercise tracking system
  };

  if (isLoading) {
    return <div>Loading exercise program...</div>;
  }

  if (error) {
    return <div>Error loading exercise program: {(error as Error).message}</div>;
  }

  if (!currentProgram) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">No Exercise Program Found</h2>
        <button 
          onClick={handleGenerateProgram}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {isGenerating ? 'Generating...' : 'Generate AI Workout Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">{currentProgram.program_name}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Week {currentProgram.current_week}</p>
            <p className="text-gray-600">Type: {workoutType}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWorkoutType('home')}
              className={`px-3 py-1 rounded ${workoutType === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Home
            </button>
            <button
              onClick={() => setWorkoutType('gym')}
              className={`px-3 py-1 rounded ${workoutType === 'gym' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Gym
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Today's Workout</h3>
        
        {isRestDay ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-xl font-medium text-gray-600">Rest Day</p>
            <p className="text-gray-500 mt-2">Take time to recover and prepare for your next workout.</p>
          </div>
        ) : todaysExercises.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No exercises planned for today.</p>
            <button 
              onClick={handleGenerateProgram}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Generate Workout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysExercises.map(exercise => (
              <div key={exercise.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                  <button
                    onClick={() => handleExerciseComplete(exercise.id)}
                    className={`px-3 py-1 rounded ${
                      exercise.completed ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {exercise.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Previous Week
        </button>
        <button
          onClick={() => setCurrentWeekOffset(0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={currentWeekOffset === 0}
        >
          Current Week
        </button>
        <button
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Next Week
        </button>
      </div>
    </div>
  );
};
