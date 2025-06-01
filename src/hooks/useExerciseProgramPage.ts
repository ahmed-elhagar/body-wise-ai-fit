
import { useState } from 'react';
import { useAIExercise } from './useAIExercise';

export interface ExercisePreferences {
  focus: string;
  equipment: string;
  duration: number;
  intensity: string;
  workoutType: string;
  goalType?: string;
  fitnessLevel?: string;
  availableTime?: string;
  preferredWorkouts?: string[];
  targetMuscleGroups?: string[];
  difficulty?: string;
  workoutDays?: string;
}

export interface ExerciseProgram {
  id: string;
  name: string;
  workout_type: 'home' | 'gym';
  difficulty: string;
  duration_weeks: number;
  created_at: string;
}

export const useExerciseProgramPage = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [programType, setProgramType] = useState('home');
  
  const { generateAIExercise, isGenerating } = useAIExercise();

  const generateExerciseProgram = async (options: any) => {
    return await generateAIExercise(options);
  };

  return {
    currentWeek,
    setCurrentWeek,
    selectedDay,
    setSelectedDay,
    programType,
    setProgramType,
    generateExerciseProgram,
    isGenerating
  };
};
