
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import OptimizedExerciseContainer from "@/components/exercise/OptimizedExerciseContainer";
import ExerciseErrorBoundary from "@/components/exercise/ExerciseErrorBoundary";
import { useState } from "react";

const Exercise = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [workoutType] = useState<'home' | 'gym'>('home');

  // Mock daily workout data - replace with real data from hooks
  const mockDailyWorkout = {
    id: '1',
    weekly_program_id: 'week-1',
    day_number: selectedDay,
    workout_name: 'Upper Body Strength',
    estimated_duration: 45,
    muscle_groups: ['chest', 'shoulders', 'triceps'],
    completed: false,
    is_rest_day: selectedDay === 7,
    exercises: selectedDay === 7 ? [] : [
      {
        id: '1',
        name: 'Push-ups',
        type: 'bodyweight',
        sets: 3,
        reps: '10-15',
        duration: null,
        rest_time: 60,
        instructions: ['Start in plank position', 'Lower body to ground', 'Push back up'],
        difficulty: 'beginner' as const,
        muscle_groups: ['chest', 'triceps'],
        equipment: [],
        completed: false
      }
    ]
  };

  const handleExerciseStart = (exerciseId: string) => {
    console.log('Starting exercise:', exerciseId);
  };

  const handleExerciseComplete = (exerciseId: string) => {
    console.log('Completing exercise:', exerciseId);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
            <OptimizedExerciseContainer
              dailyWorkout={mockDailyWorkout}
              selectedDay={selectedDay}
              onExerciseStart={handleExerciseStart}
              onExerciseComplete={handleExerciseComplete}
              workoutType={workoutType}
            />
          </div>
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
