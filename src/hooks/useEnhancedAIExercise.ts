
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedAIExercise = () => {
  const { user } = useAuth();
  const { userCredits, checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    if (!user?.id) {
      toast.error('Please log in to generate an exercise program');
      return null;
    }

    // Check credits before starting
    if (userCredits <= 0) {
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
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
      console.log('🏋️ Starting enhanced exercise program generation with preferences:', preferences);
      
      // Get user profile data for better personalization
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get user's health assessment for context
      const { data: healthAssessment } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Enhanced preferences with user context
      const enhancedPreferences = {
        ...preferences,
        userProfile: profile,
        healthContext: healthAssessment,
        userLanguage: profile?.preferred_language || 'en',
        userId: user.id
      };

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          preferences: enhancedPreferences,
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
      toast.error(error.message || 'Failed to generate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    if (!user?.id) {
      toast.error('Please log in to regenerate an exercise program');
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

  return {
    isGenerating,
    userCredits,
    generateExerciseProgram,
    regenerateProgram
  };
};
