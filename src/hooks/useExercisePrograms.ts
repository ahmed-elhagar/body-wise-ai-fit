
import { useState } from 'react';

export const useExercisePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);

  return {
    programs,
    isLoading,
    currentProgram
  };
};
