
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIExercise = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    if (!user?.id) {
      console.error('No user ID available for exercise generation');
      return null;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🏋️ Generating exercise program with preferences:', preferences);
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          preferences: preferences,
          weekStartDate: new Date().toISOString().split('T')[0]
        }
      });

      if (error) {
        console.error('❌ Exercise generation error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise program generated successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Exercise program generated successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ Exercise program generation failed:', error);
      toast.error('Failed to generate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    if (!user?.id) {
      console.error('No user ID available for exercise regeneration');
      return null;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔄 Regenerating exercise program for week:', weekStartDate);
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          regenerate: true,
          weekStartDate
        }
      });

      if (error) {
        console.error('❌ Exercise regeneration error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise program regenerated successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Exercise program regenerated successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Regeneration failed');
      }
    } catch (error) {
      console.error('❌ Exercise program regeneration failed:', error);
      toast.error('Failed to regenerate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const exchangeExercise = async (exerciseId: string, preferences: any) => {
    if (!user?.id) {
      console.error('No user ID available for exercise exchange');
      return null;
    }

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔄 Exchanging exercise:', exerciseId);
      
      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          userId: user.id,
          exerciseId,
          preferences
        }
      });

      if (error) {
        console.error('❌ Exercise exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Exercise exchanged successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Exercise exchanged successfully!');
        return data;
      } else {
        throw new Error(data?.error || 'Exchange failed');
      }
    } catch (error) {
      console.error('❌ Exercise exchange failed:', error);
      toast.error('Failed to exchange exercise');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateExerciseProgram,
    regenerateProgram,
    exchangeExercise
  };
};
