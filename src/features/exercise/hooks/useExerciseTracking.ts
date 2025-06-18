
import { useState } from 'react';

export const useExerciseTracking = () => {
  const [isTracking, setIsTracking] = useState(false);

  const startWorkout = () => {
    setIsTracking(true);
  };

  const completeWorkout = () => {
    setIsTracking(false);
  };

  return {
    startWorkout,
    completeWorkout,
    isTracking
  };
};
