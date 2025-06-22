import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useI18n } from '@/shared/hooks/useI18n';

export interface FormAnalysisRequest {
  exerciseType: string;
  videoData?: string;
  motionData?: any;
  userFeedback?: string;
}

export interface FormAnalysisResult {
  score: number;
  feedback: string[];
  improvements: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export const useFormAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<FormAnalysisResult[]>([]);
  const { toast } = useToast();
  const { t } = useI18n();

  const analyzeForm = useCallback(async (request: FormAnalysisRequest): Promise<FormAnalysisResult | null> => {
    setIsAnalyzing(true);

    try {
      // Simulate AI form analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: FormAnalysisResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        feedback: [
          t('exercise.form_feedback_1'),
          t('exercise.form_feedback_2'),
          t('exercise.form_feedback_3')
        ],
        improvements: [
          t('exercise.form_improvement_1'),
          t('exercise.form_improvement_2')
        ],
        riskLevel: 'low',
        recommendations: [
          t('exercise.form_recommendation_1'),
          t('exercise.form_recommendation_2')
        ]
      };

      setAnalysisHistory(prev => [mockResult, ...prev.slice(0, 9)]);

      toast({
        title: t('common.success'),
        description: t('exercise.form_analyzed'),
        variant: 'default'
      });

      return mockResult;

    } catch (error) {
      console.error('Form analysis failed:', error);
      toast({
        title: t('common.error'),
        description: t('exercise.form_analysis_error'),
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast, t]);

  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
  }, []);

  return {
    analyzeForm,
    isAnalyzing,
    analysisHistory,
    clearHistory
  };
}; 