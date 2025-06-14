
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useEnhancedAIExercise = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          preferences
        }
      });

      if (error) throw error;
      
      toast.success('Exercise program generated successfully!');
      return data;
    } catch (error) {
      console.error('Error generating exercise program:', error);
      toast.error('Failed to generate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-exercise-program', {
        body: {
          userId: user.id,
          weekStartDate
        }
      });

      if (error) throw error;
      
      toast.success('Exercise program regenerated successfully!');
      return data;
    } catch (error) {
      console.error('Error regenerating exercise program:', error);
      toast.error('Failed to regenerate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateExerciseProgram,
    regenerateProgram
  };
};
