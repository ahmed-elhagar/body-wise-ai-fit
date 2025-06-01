
import { useEffect } from 'react';
import { useAIExercise } from './useAIExercise';

export const useInitialAIGeneration = () => {
  const { generateAIExercise, isGenerating } = useAIExercise();

  const generateExerciseProgram = async (options: any) => {
    return await generateAIExercise(options);
  };

  return {
    generateExerciseProgram,
    isGenerating
  };
};
