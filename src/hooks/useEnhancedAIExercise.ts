
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCentralizedCredits } from './useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedAIExercise = () => {
  const { user } = useAuth();
  const { remaining: userCredits, isPro, hasCredits, checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExerciseProgram = async (preferences: any) => {
    if (!user?.id) {
      console.error('❌ User not authenticated');
      toast.error('Please log in to generate an exercise program');
      return null;
    }

    console.log('🔐 User authenticated:', user.id);

    // Check credits before starting
    if (!hasCredits) {
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
      return null;
    }

    setIsGenerating(true);
    let logId: string | undefined;
    
    try {
      console.log('🏋️ Starting enhanced exercise program generation with preferences:', preferences);
      
      // Check and use credit before starting generation
      const creditResult = await checkAndUseCredit('exercise_program');
      if (!creditResult.success) {
        return null;
      }
      logId = creditResult.logId;

      // Get user profile data for better personalization
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📊 User profile loaded:', profile ? 'success' : 'no profile found');

      // Get user's health assessment for context
      const { data: healthAssessment } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('🏥 Health assessment loaded:', healthAssessment ? 'success' : 'none found');

      // Structure the request exactly as the edge function expects
      const requestBody = {
        userData: {
          userId: user.id,
          email: user.email || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          age: profile?.age || null,
          gender: profile?.gender || null,
          height: profile?.height || null,
          weight: profile?.weight || null,
          fitness_goal: profile?.fitness_goal || null,
          activity_level: profile?.activity_level || null,
          preferred_language: profile?.preferred_language || 'en'
        },
        preferences: {
          ...preferences,
          userProfile: profile,
          healthContext: healthAssessment,
          userLanguage: profile?.preferred_language || 'en'
        },
        userLanguage: profile?.preferred_language || 'en',
        weekStartDate: preferences.weekStartDate || new Date().toISOString().split('T')[0]
      };

      console.log('🚀 Calling edge function with structured data:', {
        userId: user.id,
        workoutType: preferences.workoutType,
        weekStartDate: requestBody.weekStartDate,
        hasProfile: !!profile
      });

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: requestBody
      });

      if (error) {
        console.error('❌ Exercise generation error:', error);
        if (logId) await completeGeneration(logId, false);
        throw new Error(error.message || 'Generation failed');
      }

      if (data?.success) {
        console.log('✅ Exercise program generated successfully');
        
        // Complete the generation process
        if (logId) await completeGeneration(logId, true, data);
        
        toast.success('Exercise program generated successfully!');
        return data;
      } else {
        if (logId) await completeGeneration(logId, false);
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ Exercise program generation failed:', error);
      if (logId) await completeGeneration(logId, false);
      toast.error(error.message || 'Failed to generate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateProgram = async (weekStartDate: string) => {
    if (!user?.id) {
      console.error('❌ User not authenticated for regeneration');
      toast.error('Please log in to regenerate an exercise program');
      return null;
    }

    console.log('🔐 User authenticated for regeneration:', user.id);

    // Check credits before starting
    if (!hasCredits) {
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
      return null;
    }

    setIsGenerating(true);
    let logId: string | undefined;
    
    try {
      console.log('🔄 Regenerating exercise program for week:', weekStartDate);
      
      // Check and use credit before starting generation
      const creditResult = await checkAndUseCredit('exercise_program_regenerate');
      if (!creditResult.success) {
        return null;
      }
      logId = creditResult.logId;
      
      // Get user profile for regeneration
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Structure the request exactly as the edge function expects
      const requestBody = {
        userData: {
          userId: user.id,
          email: user.email || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          age: profile?.age || null,
          gender: profile?.gender || null,
          height: profile?.height || null,
          weight: profile?.weight || null,
          fitness_goal: profile?.fitness_goal || null,
          activity_level: profile?.activity_level || null,
          preferred_language: profile?.preferred_language || 'en'
        },
        preferences: {
          regenerate: true,
          userLanguage: profile?.preferred_language || 'en'
        },
        userLanguage: profile?.preferred_language || 'en',
        weekStartDate
      };
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: requestBody
      });

      if (error) {
        console.error('❌ Exercise regeneration error:', error);
        if (logId) await completeGeneration(logId, false);
        throw new Error(error.message || 'Regeneration failed');
      }

      if (data?.success) {
        console.log('✅ Exercise program regenerated successfully');
        
        // Complete the generation process
        if (logId) await completeGeneration(logId, true, data);
        
        toast.success('Exercise program regenerated successfully!');
        return data;
      } else {
        if (logId) await completeGeneration(logId, false);
        throw new Error(data?.error || 'Regeneration failed');
      }
    } catch (error) {
      console.error('❌ Exercise program regeneration failed:', error);
      if (logId) await completeGeneration(logId, false);
      toast.error('Failed to regenerate exercise program');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    userCredits,
    isPro,
    hasCredits,
    generateExerciseProgram,
    regenerateProgram
  };
};
