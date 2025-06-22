import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useI18n } from '@/shared/hooks/useI18n';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface ExercisePerformanceData {
  exerciseId: string;
  sets: number;
  reps: number[];
  weights: number[];
  duration: number;
  difficulty: number;
  completedAt: Date;
}

export interface ProgressMetrics {
  strengthProgress: number;
  enduranceProgress: number;
  consistencyScore: number;
  weeklyImprovement: number;
  totalWorkouts: number;
  averageDuration: number;
}

export interface AnalyticsData {
  progressMetrics: ProgressMetrics;
  recentPerformance: ExercisePerformanceData[];
  trends: {
    strength: number[];
    endurance: number[];
    frequency: number[];
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
  }[];
}

export const useExerciseAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();
  const { user } = useAuth();

  const trackPerformance = useCallback(async (data: ExercisePerformanceData) => {
    try {
      const { error } = await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId: data.exerciseId,
          userId: user?.id,
          action: 'progress_updated',
          progressData: {
            sets_completed: data.sets,
            reps_completed: data.reps,
            weight_used: data.weights,
            duration_seconds: data.duration * 60,
            difficulty_rating: data.difficulty,
            completed_at: data.completedAt.toISOString()
          },
          timestamp: data.completedAt.toISOString()
        }
      });

      if (error) {
        console.error('Performance tracking error:', error);
        toast({
          title: t('common.error'),
          description: t('exercise.tracking_failed'),
          variant: 'destructive'
        });
        return false;
      }

      await fetchAnalytics();
      return true;

    } catch (error) {
      console.error('Performance tracking failed:', error);
      return false;
    }
  }, [toast, t, user?.id]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);

    try {
      const mockData: AnalyticsData = {
        progressMetrics: {
          strengthProgress: Math.floor(Math.random() * 30) + 70,
          enduranceProgress: Math.floor(Math.random() * 25) + 75,
          consistencyScore: Math.floor(Math.random() * 20) + 80,
          weeklyImprovement: Math.floor(Math.random() * 10) + 5,
          totalWorkouts: Math.floor(Math.random() * 50) + 20,
          averageDuration: Math.floor(Math.random() * 20) + 40
        },
        recentPerformance: [],
        trends: {
          strength: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 80),
          endurance: Array.from({ length: 7 }, () => Math.floor(Math.random() * 15) + 85),
          frequency: Array.from({ length: 7 }, () => Math.floor(Math.random() * 3) + 1)
        },
        achievements: [
          {
            id: '1',
            title: t('exercise.achievement_consistency'),
            description: t('exercise.achievement_consistency_desc'),
            unlockedAt: new Date()
          }
        ]
      };

      setAnalyticsData(mockData);

    } catch (error) {
      console.error('Analytics fetch failed:', error);
      toast({
        title: t('common.error'),
        description: t('exercise.analytics_error'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analyticsData,
    isLoading,
    trackPerformance,
    refreshAnalytics: fetchAnalytics
  };
};
