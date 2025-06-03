
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
      console.error('❌ User not authenticated');
      toast.error('Please log in to generate an exercise program');
      return null;
    }

    console.log('🔐 User authenticated:', user.id);

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
      console.log('👤 User ID being sent:', user.id);
      
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

      // Create userData object as expected by the edge function
      const userData = {
        userId: user.id,
        email: user.email,
        ...profile,
        preferred_language: profile?.preferred_language || 'en'
      };

      // Enhanced preferences with user context
      const enhancedPreferences = {
        ...preferences,
        userProfile: profile,
        healthContext: healthAssessment,
        userLanguage: profile?.preferred_language || 'en'
      };

      console.log('🚀 Calling edge function with enhanced data:', {
        userId: user.id,
        workoutType: preferences.workoutType,
        weekStartDate: preferences.weekStartDate
      });

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData: userData, // Pass as userData object as expected by edge function
          preferences: enhancedPreferences,
          userLanguage: profile?.preferred_language || 'en',
          weekStartDate: preferences.weekStartDate || new Date().toISOString().split('T')[0]
        }
      });

      if (error) {
        console.error('❌ Exercise generation error:', error);
        throw new Error(error.message || 'Generation failed');
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
      console.error('❌ User not authenticated for regeneration');
      toast.error('Please log in to regenerate an exercise program');
      return null;
    }

    console.log('🔐 User authenticated for regeneration:', user.id);

    // Check and use credit before starting generation
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔄 Regenerating exercise program for week:', weekStartDate);
      console.log('👤 User ID being sent for regeneration:', user.id);
      
      // Get user profile for regeneration
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Create userData object as expected by the edge function
      const userData = {
        userId: user.id,
        email: user.email,
        ...profile,
        preferred_language: profile?.preferred_language || 'en'
      };
      
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData: userData, // Pass as userData object as expected by edge function
          preferences: {
            regenerate: true,
            userLanguage: profile?.preferred_language || 'en'
          },
          userLanguage: profile?.preferred_language || 'en',
          weekStartDate
        }
      });

      if (error) {
        console.error('❌ Exercise regeneration error:', error);
        throw new Error(error.message || 'Regeneration failed');
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
