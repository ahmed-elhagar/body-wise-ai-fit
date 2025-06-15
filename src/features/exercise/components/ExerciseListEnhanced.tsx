
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { RestDayCard } from "./RestDayCard";
import { ExerciseEmptyState } from "../../../components/exercise/ExerciseEmptyState";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  muscle_groups?: string[];
  instructions?: string;
  completed: boolean;
}

interface ExerciseListEnhancedProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
  selectedDayNumber: number;
}

export const ExerciseListEnhanced = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  selectedDayNumber
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-6">
        <SimpleLoadingIndicator
          message="Loading Exercises"
          description="Fetching your workout plan..."
        />
      </div>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <ExerciseEmptyState
        onGenerateProgram={() => console.log('Generate program')}
        workoutType="home"
        dailyWorkoutId=""
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Day {selectedDayNumber} Exercises
        </h3>
        <div className="text-sm text-gray-600">
          {exercises.filter(e => e.completed).length} of {exercises.length} completed
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
          />
        ))}
      </div>

      {/* Completion Message */}
      {exercises.length > 0 && exercises.every(e => e.completed) && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">🎉</span>
          </div>
          <h3 className="text-lg font-bold text-green-800 mb-2">
            Workout Complete!
          </h3>
          <p className="text-green-700">
            Amazing job! You've completed all exercises for today.
          </p>
        </Card>
      )}
    </div>
  );
};
