
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { ExercisePreferences } from './useOptimizedExerciseProgramPage';

export const useAIExerciseProgram = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProgram = async (
    preferences: ExercisePreferences, 
    options?: { weekOffset?: number }
  ) => {
    setIsGenerating(true);
    
    try {
      console.log('🚀 Generating AI exercise program:', preferences);
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          preferences,
          weekOffset: options?.weekOffset || 0
        }
      });

      if (error) {
        console.error('❌ Error generating exercise program:', error);
        toast.error('Failed to generate exercise program');
        return { success: false, error: error.message };
      }

      if (data?.success) {
        toast.success('Exercise program generated successfully!');
        return { success: true, programId: data.programId };
      } else {
        console.error('❌ Generation failed:', data?.error);
        toast.error(data?.error || 'Failed to generate exercise program');
        return { success: false, error: data?.error };
      }
      
    } catch (error) {
      console.error('❌ Exception generating exercise program:', error);
      toast.error('Failed to generate exercise program');
      return { success: false, error: (error as Error).message };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateProgram,
    isGenerating
  };
};
