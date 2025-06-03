
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
    console.log('🚀 [generateExerciseProgram] Starting with preferences:', preferences);
    
    if (!user?.id) {
      console.error('❌ [generateExerciseProgram] No user authenticated');
      toast.error('Please log in to generate an exercise program');
      return null;
    }

    console.log('🔐 [generateExerciseProgram] User authenticated:', user.id);

    // Check credits before starting
    console.log('💰 [generateExerciseProgram] Checking credits, current:', userCredits);
    if (userCredits <= 0) {
      console.log('🚫 [generateExerciseProgram] No credits remaining');
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
      return null;
    }

    // Check and use credit before starting generation
    console.log('💳 [generateExerciseProgram] Using credit...');
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      console.log('❌ [generateExerciseProgram] Credit check failed');
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    console.log('⏳ [generateExerciseProgram] Generation started, isGenerating set to true');
    
    try {
      // Get user profile data for better personalization
      console.log('📊 [generateExerciseProgram] Fetching user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ [generateExerciseProgram] Profile fetch error:', profileError);
      } else {
        console.log('✅ [generateExerciseProgram] Profile loaded successfully');
      }

      // Get user's health assessment for context
      console.log('🏥 [generateExerciseProgram] Fetching health assessment...');
      const { data: healthAssessment, error: healthError } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (healthError) {
        console.error('❌ [generateExerciseProgram] Health assessment fetch error:', healthError);
      } else {
        console.log('✅ [generateExerciseProgram] Health assessment loaded:', !!healthAssessment);
      }

      // Enhanced preferences with user context
      const enhancedPreferences = {
        ...preferences,
        userProfile: profile,
        healthContext: healthAssessment,
        userLanguage: profile?.preferred_language || 'en',
        userId: user.id
      };

      console.log('📋 [generateExerciseProgram] Enhanced preferences prepared:', {
        workoutType: enhancedPreferences.workoutType,
        goalType: enhancedPreferences.goalType,
        fitnessLevel: enhancedPreferences.fitnessLevel,
        userId: user.id
      });

      const requestBody = {
        userId: user.id,
        preferences: enhancedPreferences,
        weekStartDate: preferences.weekStartDate || new Date().toISOString().split('T')[0]
      };

      console.log('🚀 [generateExerciseProgram] Calling edge function with:', requestBody);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: requestBody
      });

      console.log('📡 [generateExerciseProgram] Edge function response:', { data, error });

      if (error) {
        console.error('❌ [generateExerciseProgram] Edge function error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ [generateExerciseProgram] Program generated successfully');
        
        // Complete the generation process
        console.log('🏁 [generateExerciseProgram] Completing generation...');
        await completeGenerationAsync();
        
        toast.success('Exercise program generated successfully!');
        return data;
      } else {
        console.error('❌ [generateExerciseProgram] Generation failed:', data?.error);
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ [generateExerciseProgram] Critical error:', error);
      toast.error(error.message || 'Failed to generate exercise program');
      throw error;
    } finally {
      console.log('🏁 [generateExerciseProgram] Setting isGenerating to false');
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    console.log('🔄 [regenerateProgram] Starting regeneration for week:', weekStartDate);
    
    if (!user?.id) {
      console.error('❌ [regenerateProgram] No user authenticated');
      toast.error('Please log in to regenerate an exercise program');
      return null;
    }

    console.log('🔐 [regenerateProgram] User authenticated:', user.id);

    // Check and use credit before starting generation
    console.log('💳 [regenerateProgram] Using credit...');
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      console.log('❌ [regenerateProgram] No credits remaining');
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    console.log('⏳ [regenerateProgram] Regeneration started');
    
    try {
      const requestBody = {
        userId: user.id,
        regenerate: true,
        weekStartDate
      };

      console.log('🚀 [regenerateProgram] Calling edge function with:', requestBody);
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: requestBody
      });

      console.log('📡 [regenerateProgram] Edge function response:', { data, error });

      if (error) {
        console.error('❌ [regenerateProgram] Edge function error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ [regenerateProgram] Program regenerated successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Exercise program regenerated successfully!');
        return data;
      } else {
        console.error('❌ [regenerateProgram] Regeneration failed:', data?.error);
        throw new Error(data?.error || 'Regeneration failed');
      }
    } catch (error) {
      console.error('❌ [regenerateProgram] Critical error:', error);
      toast.error('Failed to regenerate exercise program');
      throw error;
    } finally {
      console.log('🏁 [regenerateProgram] Setting isGenerating to false');
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
