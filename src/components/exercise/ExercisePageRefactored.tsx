import React, { useState, useEffect } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { Card } from "@/components/ui/card";
import { ExerciseHeader } from './ExerciseHeader';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { ExerciseList } from './ExerciseList';
import { EmptyExerciseState } from './EmptyExerciseState';
import { ExerciseProgramErrorState } from './ExerciseProgramErrorState';
import { ExerciseProgramActions } from './ExerciseProgramActions';
import { AIExerciseDialog } from './AIExerciseDialog';
import { ExerciseListEnhanced } from './ExerciseListEnhanced';
import { ExerciseCompactNavigation } from './ExerciseCompactNavigation';
import { CompactWorkoutSummary } from './CompactWorkoutSummary';
import type { Exercise } from '@/types/exercise';

interface ExerciseProgram {
  id: string;
  name: string;
  difficulty_level: string;
  estimated_duration: number;
  daily_workouts: DailyWorkout[];
  current_week: number;
}

interface DailyWorkout {
  day_number: number;
  is_rest_day: boolean;
  exercises: Exercise[];
  workout_name: string;
  estimated_duration: number;
  estimated_calories: number;
  muscle_groups: string[];
}

const initialAiPreferences = {
  goal: 'weight_loss',
  level: 'beginner',
  daysPerWeek: '3',
  duration: '30',
};

const today = new Date();
const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));

const ExercisePageRefactored = () => {
  const { t } = useI18n();
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 1);
  const [currentProgram, setCurrentProgram] = useState<ExerciseProgram | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAIDialog, setShowAIDialog] = useState<boolean>(false);
  const [aiPreferences, setAiPreferences] = useState(initialAiPreferences);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const storedWorkoutType = localStorage.getItem('workoutType') as "home" | "gym" | null;
    if (storedWorkoutType) {
      setWorkoutType(storedWorkoutType);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutType', workoutType);
    fetchExerciseProgram();
  }, [workoutType]);

  useEffect(() => {
    fetchExerciseProgram();
  }, [selectedDay]);

  const fetchExerciseProgram = async () => {
    setIsLoading(true);
    setError(false);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData: ExerciseProgram = {
        id: '1',
        name: 'AI Generated Program',
        difficulty_level: 'Intermediate',
        estimated_duration: 45,
        current_week: 1,
        daily_workouts: [
          {
            day_number: 1,
            is_rest_day: false,
            workout_name: 'Full Body Strength',
            estimated_duration: 60,
            estimated_calories: 350,
            muscle_groups: ['Chest', 'Back', 'Legs'],
            exercises: [
              { id: '101', daily_workout_id: 'dw1', name: 'Push-ups', sets: 3, reps: '8-12', completed: false },
              { id: '102', daily_workout_id: 'dw1', name: 'Squats', sets: 3, reps: '12-15', completed: false },
            ],
          },
          {
            day_number: 2,
            is_rest_day: false,
            workout_name: 'Cardio & Abs',
            estimated_duration: 45,
            estimated_calories: 300,
            muscle_groups: ['Abs', 'Cardiovascular'],
            exercises: [
              { id: '201', daily_workout_id: 'dw2', name: 'Running', sets: 1, reps: '30 minutes', completed: false },
              { id: '202', daily_workout_id: 'dw2', name: 'Crunches', sets: 3, reps: '15-20', completed: false },
            ],
          },
          {
            day_number: 3,
            is_rest_day: true,
            workout_name: 'Rest Day',
            estimated_duration: 0,
            estimated_calories: 0,
            muscle_groups: [],
            exercises: [],
          },
          {
            day_number: 4,
            is_rest_day: false,
            workout_name: 'Upper Body Focus',
            estimated_duration: 50,
            estimated_calories: 320,
            muscle_groups: ['Chest', 'Shoulders', 'Arms'],
            exercises: [
              { id: '401', name: 'Bench Press', sets: 3, reps: '8-10', completed: false },
              { id: '402', name: 'Bicep Curls', sets: 3, reps: '10-12', completed: false },
            ],
          },
          {
            day_number: 5,
            is_rest_day: false,
            workout_name: 'Lower Body & Core',
            estimated_duration: 55,
            estimated_calories: 330,
            muscle_groups: ['Legs', 'Abs'],
            exercises: [
              { id: '501', name: 'Lunges', sets: 3, reps: '10 each leg', completed: false },
              { id: '502', name: 'Plank', sets: 3, reps: '30 seconds', completed: false },
            ],
          },
          {
            day_number: 6,
            is_rest_day: false,
            workout_name: 'Full Body Circuit',
            estimated_duration: 65,
            estimated_calories: 400,
            muscle_groups: ['Full Body'],
            exercises: [
              { id: '601', name: 'Burpees', sets: 3, reps: '10-15', completed: false },
              { id: '602', name: 'Mountain Climbers', sets: 3, reps: '20 each leg', completed: false },
            ],
          },
          {
            day_number: 7,
            is_rest_day: true,
            workout_name: 'Active Recovery',
            estimated_duration: 30,
            estimated_calories: 150,
            muscle_groups: ['Cardiovascular'],
            exercises: [
              { id: '701', name: 'Light Jogging', sets: 1, reps: '30 minutes', completed: false },
            ],
          },
        ]
      };

      setCurrentProgram(mockData);
    } catch (err) {
      console.error("Failed to fetch exercise program:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateProgram = async () => {
    setIsGenerating(true);
    setError(false);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock new program data
      const mockData: ExerciseProgram = {
        id: '2',
        name: 'AI Generated Program v2',
        difficulty_level: 'Advanced',
        estimated_duration: 60,
        current_week: 1,
        daily_workouts: [
          {
            day_number: 1,
            is_rest_day: false,
            workout_name: 'Advanced Strength',
            estimated_duration: 75,
            estimated_calories: 400,
            muscle_groups: ['Chest', 'Back', 'Legs'],
            exercises: [
              { id: '801', name: 'Incline Press', sets: 4, reps: '6-8', completed: false },
              { id: '802', name: 'Deadlifts', sets: 3, reps: '5-8', completed: false },
            ],
          },
          {
            day_number: 2,
            is_rest_day: false,
            workout_name: 'HIIT Cardio',
            estimated_duration: 40,
            estimated_calories: 350,
            muscle_groups: ['Cardiovascular'],
            exercises: [
              { id: '901', name: 'Sprints', sets: 8, reps: '30 seconds', completed: false },
              { id: '902', name: 'Box Jumps', sets: 3, reps: '10', completed: false },
            ],
          },
          {
            day_number: 3,
            is_rest_day: true,
            workout_name: 'Rest Day',
            estimated_duration: 0,
            estimated_calories: 0,
            muscle_groups: [],
            exercises: [],
          },
          {
            day_number: 4,
            is_rest_day: false,
            workout_name: 'Olympic Lifting',
            estimated_duration: 70,
            estimated_calories: 420,
            muscle_groups: ['Full Body'],
            exercises: [
              { id: '1001', name: 'Clean & Jerk', sets: 3, reps: '3-5', completed: false },
              { id: '1002', name: 'Snatch', sets: 3, reps: '3-5', completed: false },
            ],
          },
          {
            day_number: 5,
            is_rest_day: false,
            workout_name: 'Calisthenics',
            estimated_duration: 60,
            estimated_calories: 380,
            muscle_groups: ['Full Body'],
            exercises: [
              { id: '1101', name: 'Muscle Ups', sets: 3, reps: 'As Many As Possible', completed: false },
              { id: '1102', name: 'Handstand Push-ups', sets: 3, reps: '5-8', completed: false },
            ],
          },
          {
            day_number: 6,
            is_rest_day: false,
            workout_name: 'Endurance Training',
            estimated_duration: 90,
            estimated_calories: 500,
            muscle_groups: ['Cardiovascular'],
            exercises: [
              { id: '1201', name: 'Long Distance Run', sets: 1, reps: '60 minutes', completed: false },
              { id: '1202', name: 'Cycling', sets: 1, reps: '30 minutes', completed: false },
            ],
          },
          {
            day_number: 7,
            is_rest_day: true,
            workout_name: 'Yoga & Mobility',
            estimated_duration: 45,
            estimated_calories: 200,
            muscle_groups: ['Flexibility'],
            exercises: [
              { id: '1301', name: 'Vinyasa Flow', sets: 1, reps: '45 minutes', completed: false },
            ],
          },
        ]
      };

      setCurrentProgram(mockData);
    } catch (err) {
      console.error("Failed to regenerate exercise program:", err);
      setError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExerciseComplete = (exerciseId: string) => {
    setCurrentProgram((prevProgram: any) => {
      if (!prevProgram || !prevProgram.daily_workouts) return prevProgram;

      const updatedWorkouts = prevProgram.daily_workouts.map((workout: any) => {
        if (workout.day_number === selectedDay) {
          const updatedExercises = workout.exercises.map((exercise: any) => {
            if (exercise.id === exerciseId) {
              return { ...exercise, completed: true };
            }
            return exercise;
          });
          return { ...workout, exercises: updatedExercises };
        }
        return workout;
      });

      return { ...prevProgram, daily_workouts: updatedWorkouts };
    });
  };

  const handleExerciseProgressUpdate = (exerciseId: string, sets: number, reps: string, notes?: string) => {
    setCurrentProgram((prevProgram: any) => {
      if (!prevProgram || !prevProgram.daily_workouts) return prevProgram;
  
      const updatedWorkouts = prevProgram.daily_workouts.map((workout: any) => {
        if (workout.day_number === selectedDay) {
          const updatedExercises = workout.exercises.map((exercise: any) => {
            if (exercise.id === exerciseId) {
              return { ...exercise, sets, reps, notes };
            }
            return exercise;
          });
          return { ...workout, exercises: updatedExercises };
        }
        return workout;
      });
  
      return { ...prevProgram, daily_workouts: updatedWorkouts };
    });
  };

  const handleShowAIDialog = () => {
    setShowAIDialog(true);
  };

  const handleGenerateAIProgram = async (preferences: any) => {
    setIsGenerating(true);
    setError(false);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock new program data based on preferences
      const mockData: ExerciseProgram = {
        id: '3',
        name: `AI ${preferences.goal} Program`,
        difficulty_level: preferences.level,
        estimated_duration: parseInt(preferences.duration),
        current_week: 1,
        daily_workouts: [
          {
            day_number: 1,
            is_rest_day: false,
            workout_name: 'Custom Workout',
            estimated_duration: parseInt(preferences.duration),
            estimated_calories: 300,
            muscle_groups: ['Full Body'],
            exercises: [
              { id: '1401', name: 'Custom Exercise 1', sets: 3, reps: '10', completed: false },
              { id: '1402', name: 'Custom Exercise 2', sets: 3, reps: '12', completed: false },
            ],
          },
          {
            day_number: 2,
            is_rest_day: true,
            workout_name: 'Rest Day',
            estimated_duration: 0,
            estimated_calories: 0,
            muscle_groups: [],
            exercises: [],
          },
          {
            day_number: 3,
            is_rest_day: false,
            workout_name: 'Custom Workout',
            estimated_duration: parseInt(preferences.duration),
            estimated_calories: 320,
            muscle_groups: ['Full Body'],
            exercises: [
              { id: '1501', name: 'Custom Exercise 3', sets: 3, reps: '10', completed: false },
              { id: '1502', name: 'Custom Exercise 4', sets: 3, reps: '12', completed: false },
            ],
          },
        ]
      };

      setCurrentProgram(mockData);
    } catch (err) {
      console.error("Failed to generate AI exercise program:", err);
      setError(true);
    } finally {
      setIsGenerating(false);
      setShowAIDialog(false);
    }
  };

  const todaysWorkouts = currentProgram?.daily_workouts?.filter(workout => workout.day_number === selectedDay) || [];
  const todaysExercises = todaysWorkouts.length > 0 ? todaysWorkouts[0].exercises : [];
  const isRestDay = todaysWorkouts.length > 0 && todaysWorkouts[0].is_rest_day;

  const completedExercises = todaysExercises?.filter(ex => ex.completed).length || 0;
  const totalExercises = todaysExercises?.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleRetry = () => {
    fetchExerciseProgram();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Actions */}
      <div className="mb-6">
        <ExerciseCompactNavigation
          currentWeekOffset={0}
          setCurrentWeekOffset={() => {}}
          weekStartDate={startOfWeek}
          selectedDayNumber={selectedDay}
          setSelectedDayNumber={setSelectedDay}
          currentProgram={currentProgram}
          workoutType={workoutType}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <CompactWorkoutSummary
            todaysWorkouts={todaysWorkouts}
            currentProgram={currentProgram}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            workoutType={workoutType}
            selectedDay={selectedDay}
            isRestDay={isRestDay}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="lg:col-span-3">
              <div className="text-center py-12">
                <div className="w-10 h-10 animate-spin border-4 border-health-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-health-text-secondary text-lg font-medium">{t('exercise.loadingExercises')}</p>
              </div>
            </div>
          ) : error ? (
            <ExerciseProgramErrorState onRetry={handleRetry} />
          ) : !currentProgram ? (
            <EmptyExerciseState
              onGenerateProgram={() => setShowAIDialog(true)}
              workoutType={workoutType}
              setWorkoutType={setWorkoutType}
              showAIDialog={showAIDialog}
              setShowAIDialog={setShowAIDialog}
              aiPreferences={aiPreferences}
              setAiPreferences={setAiPreferences}
              isGenerating={isGenerating}
            />
          ) : (
            <ExerciseListEnhanced
              exercises={todaysExercises}
              isLoading={isLoading}
              onExerciseComplete={() => {}}
              onExerciseProgressUpdate={() => {}}
              isRestDay={isRestDay}
            />
          )}
        </div>
      </div>

      {/* AI Dialog */}
      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={() => {}}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ExercisePageRefactored;
