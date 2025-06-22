
import { useState } from 'react';

export const useAIExercise = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    setIsGenerating(true);
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generated exercise program with preferences:', preferences);
    } catch (error) {
      console.error('Error generating exercise program:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExerciseProgram,
    isGenerating
  };
};
