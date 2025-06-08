
import React, { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { Exercise } from "@/types/exercise";
import EnhancedDayNavigation from "./EnhancedDayNavigation";
import { EnhancedExerciseListContainer } from "./EnhancedExerciseListContainer";

interface EnhancedExercisePageProps {
  exercises: Exercise[];
  currentDay: number;
  onDayChange: (day: number) => void;
  workoutType: "home" | "gym";
}

export const EnhancedExercisePage = ({
  exercises,
  currentDay,
  onDayChange,
  workoutType
}: EnhancedExercisePageProps) => {
  const { isRTL } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const handleExerciseStart = (index: number) => {
    setCurrentExerciseIndex(index);
    setIsWorkoutActive(true);
  };

  const handleExerciseComplete = (index: number) => {
    if (index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
    } else {
      setIsWorkoutActive(false);
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <EnhancedDayNavigation
        selectedDay={currentDay}
        onDaySelect={onDayChange}
        workoutType={workoutType}
      />
      
      <EnhancedExerciseListContainer
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseComplete={handleExerciseComplete}
        onExerciseStart={handleExerciseStart}
        workoutType={workoutType}
        isWorkoutActive={isWorkoutActive}
      />
    </div>
  );
};

export default EnhancedExercisePage;
