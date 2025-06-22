import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useI18n } from '@/shared/hooks/useI18n';

export interface AIWorkoutRequest {
  goalType: string;
  experienceLevel: string;
  equipment: string[];
  duration: number;
  focusAreas: string[];
  injuries?: string[];
  preferences?: string;
}

export interface WorkoutGenerationResponse {
  exercises: any[];
  estimatedDuration: number;
  difficultyLevel: string;
  equipment: string[];
  instructions: string;
}

export const useAIWorkoutGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();
  const { t } = useI18n();

  const generateWorkout = useCallback(async (request: AIWorkoutRequest): Promise<WorkoutGenerationResponse | null> => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          goal_type: request.goalType,
          experience_level: request.experienceLevel,
          available_equipment: request.equipment,
          workout_duration: request.duration,
          focus_areas: request.focusAreas,
          injuries: request.injuries || [],
          preferences: request.preferences || '',
          ai_enhanced: true
        }
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (error) {
        console.error('Workout generation error:', error);
        toast({
          title: t('common.error'),
          description: t('exercise.generation_failed'),
          variant: 'destructive'
        });
        return null;
      }

      toast({
        title: t('common.success'),
        description: t('exercise.workout_generated'),
        variant: 'default'
      });

      return {
        exercises: data.exercises || [],
        estimatedDuration: data.estimated_duration || request.duration,
        difficultyLevel: data.difficulty_level || 'intermediate',
        equipment: data.required_equipment || request.equipment,
        instructions: data.instructions || ''
      };

    } catch (error) {
      console.error('AI workout generation failed:', error);
      toast({
        title: t('common.error'),
        description: t('exercise.generation_error'),
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  }, [toast, t]);

  return {
    generateWorkout,
    isGenerating,
    generationProgress
  };
}; 