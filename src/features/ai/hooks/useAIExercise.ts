
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRole } from './useRole';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIExercise = () => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    if (!user?.id) {
      console.error('No user ID available for exercise generation');
      return null;
    }

    const creditResult = await checkAndUseCredit('exercise-generation');
    if (!creditResult.success) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🏋️ Generating exercise program with AI');
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          preferences: preferences,
          isAdmin: isAdmin
        }
      });

      if (error) {
        console.error('❌ Exercise generation error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise program generated successfully');
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        toast.success('Exercise program generated successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Exercise generation failed');
      }
    } catch (error: any) {
      console.error('❌ Exercise generation failed:', error);
      toast.error('Failed to generate exercise program');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExerciseProgram,
    isGenerating
  };
};
