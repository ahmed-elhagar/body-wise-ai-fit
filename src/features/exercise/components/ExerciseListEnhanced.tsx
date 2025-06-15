
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { RestDayCard } from "./RestDayCard";
import { ExerciseEmptyState } from "./ExerciseEmptyState";
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

  const completedCount = exercises.filter(e => e.completed).length;
  const totalCount = exercises.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Day {selectedDayNumber} Workout
            </h2>
            <p className="text-gray-600">
              {completedCount} of {totalCount} exercises completed
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 68 68">
                <circle
                  cx="34"
                  cy="34"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="34"
                  cy="34"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${(progressPercentage / 100) * 188} 188`}
                  className={progressPercentage === 100 ? 'text-green-500' : 'text-blue-500'}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Exercise Cards */}
      <div className="space-y-4">
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

      {/* Completion Celebration */}
      {completedCount === totalCount && totalCount > 0 && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Fantastic Work!
          </h3>
          <p className="text-green-700 mb-4">
            You've completed all exercises for Day {selectedDayNumber}. Great job staying consistent!
          </p>
          <div className="text-sm text-green-600">
            Keep up the momentum for tomorrow's workout!
          </div>
        </Card>
      )}
    </div>
  );
};
