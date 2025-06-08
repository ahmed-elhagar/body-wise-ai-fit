
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import { Exercise } from "@/types/exercise";
import ActiveExerciseTracker from "./ActiveExerciseTracker";
import OptimizedExerciseList from "./OptimizedExerciseList";
import CustomExerciseDialog from "./CustomExerciseDialog";

interface EnhancedExerciseListContainerProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  onExerciseComplete: (index: number) => void;
  onExerciseStart: (index: number) => void;
  workoutType: "home" | "gym";
  isWorkoutActive: boolean;
}

export const EnhancedExerciseListContainer = ({
  exercises,
  currentExerciseIndex,
  onExerciseComplete,
  onExerciseStart,
  workoutType,
  isWorkoutActive
}: EnhancedExerciseListContainerProps) => {
  const { isRTL } = useI18n();

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {isWorkoutActive && (
        <ActiveExerciseTracker
          exercise={exercises[currentExerciseIndex]}
          onComplete={() => onExerciseComplete(currentExerciseIndex)}
        />
      )}
      
      <OptimizedExerciseList
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        workoutType={workoutType}
        onExerciseStart={onExerciseStart}
        onExerciseComplete={onExerciseComplete}
      />
    </div>
  );
};
