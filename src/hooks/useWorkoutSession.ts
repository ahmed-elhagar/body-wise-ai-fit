
import { useState } from 'react';

export const useWorkoutSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  const startSession = () => {
    setIsActive(true);
  };

  const endSession = () => {
    setIsActive(false);
    setCurrentExercise(null);
  };

  return {
    isActive,
    currentExercise,
    startSession,
    endSession,
    setCurrentExercise
  };
};
