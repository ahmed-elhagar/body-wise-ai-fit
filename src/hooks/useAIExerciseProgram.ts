
import { useState } from 'react';
import { toast } from 'sonner';

export interface ExercisePreferences {
  workoutType: "home" | "gym";
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  fitnessGoals: string[];
  availableEquipment: string[];
  timePerWorkout: number;
  workoutsPerWeek: number;
  focusAreas: string[];
  goalType?: string;
  fitnessLevel?: string;
  availableTime?: number;
  preferredWorkouts?: string[];
}

export const useAIExerciseProgram = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProgram = async (preferences: ExercisePreferences, options?: { weekOffset?: number }) => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for exercise program generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Exercise program generated successfully!');
      
      return { success: true };
    } catch (error) {
      console.error('Failed to generate exercise program:', error);
      toast.error('Failed to generate exercise program');
      return { success: false };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateProgram,
    isGenerating
  };
};
