
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Dumbbell, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";

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
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay: boolean;
  selectedDayNumber: number;
}

export const ExerciseListEnhanced = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay,
  selectedDayNumber
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();
  const { formatTime } = useWorkoutTimer();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No exercises for today
        </h3>
        <p className="text-gray-500">
          Check back later or generate a new workout program
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className={`p-4 transition-all duration-200 ${
          exercise.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                {exercise.completed && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.sets && (
                  <Badge variant="outline" className="text-xs">
                    {exercise.sets} sets
                  </Badge>
                )}
                {exercise.reps && (
                  <Badge variant="outline" className="text-xs">
                    {exercise.reps} reps
                  </Badge>
                )}
                {exercise.rest_seconds && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(exercise.rest_seconds)} rest
                  </Badge>
                )}
              </div>
              
              {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.muscle_groups.map((group, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {group}
                    </Badge>
                  ))}
                </div>
              )}
              
              {exercise.instructions && (
                <p className="text-sm text-gray-600 mb-3">
                  {exercise.instructions}
                </p>
              )}
            </div>
            
            <div className="ml-4 space-y-2">
              {!exercise.completed ? (
                <Button
                  onClick={() => onExerciseComplete(exercise.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              ) : (
                <Badge className="bg-green-600">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
