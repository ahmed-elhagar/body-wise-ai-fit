
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExercisePreferences {
  difficultyLevel: string;
  fitnessGoals: string[];
  availableEquipment: string[];
  timePerWorkout: string;
  workoutsPerWeek: string;
  workoutType: string;
}

export const useAIExerciseProgram = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = useCallback(async (preferences: ExercisePreferences) => {
    if (!user) {
      toast.error('Please log in to generate exercise program');
      return { success: false };
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userProfile: user,
          preferences
        }
      });

      if (error) {
        console.error('Error generating exercise program:', error);
        toast.error('Failed to generate exercise program');
        return { success: false, error };
      }

      toast.success('Exercise program generated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Exception generating exercise program:', error);
      toast.error('Failed to generate exercise program');
      return { success: false, error };
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  return {
    generateExerciseProgram,
    isGenerating
  };
};
