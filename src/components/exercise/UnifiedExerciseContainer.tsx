
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import InteractiveExerciseCard from "./InteractiveExerciseCard";
import { Exercise } from "@/types/exercise";

interface UnifiedExerciseContainerProps {
  exercises: Exercise[];
  onExerciseStart: (exerciseId: string) => void;
  onExerciseComplete: (exerciseId: string) => void;
  workoutType: "home" | "gym";
}

const UnifiedExerciseContainer = ({
  exercises,
  onExerciseStart,
  onExerciseComplete,
  workoutType
}: UnifiedExerciseContainerProps) => {
  const { t, isRTL } = useI18n();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
  };

  const handlePauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const handleResetWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentExerciseIndex(0);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Workout Controls */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {workoutType === 'home' ? t('exercise:homeWorkout') : t('exercise:gymWorkout')}
              </h3>
              <p className="text-sm text-gray-600">
                {exercises.length} exercises • {isWorkoutActive ? 'Active' : 'Ready to start'}
              </p>
            </div>
            
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {!isWorkoutActive ? (
                <Button onClick={handleStartWorkout}>
                  <Play className="w-4 h-4 mr-2" />
                  {t('exercise:startWorkout') || 'Start Workout'}
                </Button>
              ) : (
                <>
                  <Button onClick={handlePauseWorkout} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    {t('exercise:pause') || 'Pause'}
                  </Button>
                  <Button onClick={handleResetWorkout} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('exercise:reset') || 'Reset'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <InteractiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={() => onExerciseStart(exercise.id)}
            onComplete={() => onExerciseComplete(exercise.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UnifiedExerciseContainer;
