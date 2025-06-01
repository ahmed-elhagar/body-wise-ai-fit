
import { useState } from 'react';
import { useExerciseProgramQuery } from './useExerciseProgramQuery';
import { useAIExercise } from './useAIExercise';

export const useOptimizedExerciseProgramPage = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [workoutType, setWorkoutType] = useState<'home' | 'gym'>('home');
  
  const exerciseData = useExerciseProgramQuery();
  const { generateAIExercise, isGenerating } = useAIExercise();

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const handleWorkoutTypeChange = (type: 'home' | 'gym') => {
    setWorkoutType(type);
  };

  const handleGenerateProgram = async (options: any) => {
    return await generateAIExercise(options);
  };

  return {
    selectedDay,
    workoutType,
    program: exerciseData.program,
    workout: exerciseData.workout,
    exercises: exerciseData.exercises,
    isLoading: exerciseData.isLoading,
    error: exerciseData.error,
    isGenerating,
    handleDaySelect,
    handleWorkoutTypeChange,
    handleGenerateProgram,
    refetch: exerciseData.refetch
  };
};
