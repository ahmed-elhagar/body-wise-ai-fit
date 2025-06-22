import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useI18n } from '@/shared/hooks/useI18n';

export interface RecoveryMetrics {
  sleepQuality: number;
  stressLevel: number;
  musclesSoreness: number;
  energyLevel: number;
  heartRateVariability?: number;
}

export interface RecoveryRecommendation {
  type: 'rest' | 'active_recovery' | 'light_workout' | 'normal_workout';
  intensity: number;
  duration: number;
  activities: string[];
  reasoning: string;
}

export const useRecoveryOptimization = () => {
  const [recoveryData, setRecoveryData] = useState<RecoveryMetrics | null>(null);
  const [recommendation, setRecommendation] = useState<RecoveryRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const analyzeRecovery = useCallback(async (metrics: RecoveryMetrics): Promise<RecoveryRecommendation | null> => {
    setIsAnalyzing(true);
    setRecoveryData(metrics);

    try {
      // Calculate recovery score
      const recoveryScore = (
        metrics.sleepQuality * 0.3 +
        (10 - metrics.stressLevel) * 0.25 +
        (10 - metrics.musclesSoreness) * 0.25 +
        metrics.energyLevel * 0.2
      );

      let recommendationType: RecoveryRecommendation['type'];
      let intensity: number;
      let activities: string[];

      if (recoveryScore >= 8) {
        recommendationType = 'normal_workout';
        intensity = 85;
        activities = [
          t('exercise.recovery_normal_1'),
          t('exercise.recovery_normal_2'),
          t('exercise.recovery_normal_3')
        ];
      } else if (recoveryScore >= 6) {
        recommendationType = 'light_workout';
        intensity = 60;
        activities = [
          t('exercise.recovery_light_1'),
          t('exercise.recovery_light_2'),
          t('exercise.recovery_light_3')
        ];
      } else if (recoveryScore >= 4) {
        recommendationType = 'active_recovery';
        intensity = 40;
        activities = [
          t('exercise.recovery_active_1'),
          t('exercise.recovery_active_2'),
          t('exercise.recovery_active_3')
        ];
      } else {
        recommendationType = 'rest';
        intensity = 20;
        activities = [
          t('exercise.recovery_rest_1'),
          t('exercise.recovery_rest_2'),
          t('exercise.recovery_rest_3')
        ];
      }

      const newRecommendation: RecoveryRecommendation = {
        type: recommendationType,
        intensity,
        duration: recommendationType === 'rest' ? 0 : 30 + (intensity / 2),
        activities,
        reasoning: t(`exercise.recovery_reasoning_${recommendationType}`)
      };

      setRecommendation(newRecommendation);

      toast({
        title: t('common.success'),
        description: t('exercise.recovery_analyzed'),
        variant: 'default'
      });

      return newRecommendation;

    } catch (error) {
      console.error('Recovery analysis failed:', error);
      toast({
        title: t('common.error'),
        description: t('exercise.recovery_analysis_error'),
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast, t]);

  return {
    recoveryData,
    recommendation,
    analyzeRecovery,
    isAnalyzing
  };
}; 