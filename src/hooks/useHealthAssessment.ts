
import { useState } from 'react';
import { useAuth } from './useAuth';

interface HealthAssessment {
  id?: string;
  user_id?: string;
  stress_level: number | null;
  sleep_quality: number | null;
  energy_level: number | null;
  work_schedule: string | null;
  exercise_frequency: number | null;
  health_goals: string[];
  medical_conditions: string[];
  current_medications: string[];
  
  // Additional properties that components expect
  chronic_conditions: string[];
  medications: string[];
  injuries: string[];
  physical_limitations: string[];
  exercise_history: string;
  nutrition_knowledge: string;
  cooking_skills: string;
  time_availability: string;
  primary_motivation: string;
  specific_goals: string[];
  timeline_expectation: string;
  commitment_level: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface HealthAssessmentInput {
  stress_level?: number;
  sleep_quality?: number;
  energy_level?: number;
  work_schedule?: string;
  exercise_frequency?: number;
  health_goals?: string[];
  medical_conditions?: string[];
  current_medications?: string[];
  chronic_conditions?: string[];
  medications?: string[];
  injuries?: string[];
  physical_limitations?: string[];
  exercise_history?: string;
  nutrition_knowledge?: string;
  cooking_skills?: string;
  time_availability?: string;
  primary_motivation?: string;
  specific_goals?: string[];
  timeline_expectation?: string;
  commitment_level?: string;
}

export const useHealthAssessment = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssessment = async (assessmentData: Partial<HealthAssessment>) => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    try {
      const newAssessment: HealthAssessment = {
        ...assessmentData,
        user_id: user.id,
        stress_level: assessmentData.stress_level || null,
        sleep_quality: assessmentData.sleep_quality || null,
        energy_level: assessmentData.energy_level || null,
        work_schedule: assessmentData.work_schedule || null,
        exercise_frequency: assessmentData.exercise_frequency || null,
        health_goals: assessmentData.health_goals || [],
        medical_conditions: assessmentData.medical_conditions || [],
        current_medications: assessmentData.current_medications || [],
        chronic_conditions: assessmentData.chronic_conditions || [],
        medications: assessmentData.medications || [],
        injuries: assessmentData.injuries || [],
        physical_limitations: assessmentData.physical_limitations || [],
        exercise_history: assessmentData.exercise_history || '',
        nutrition_knowledge: assessmentData.nutrition_knowledge || '',
        cooking_skills: assessmentData.cooking_skills || '',
        time_availability: assessmentData.time_availability || '',
        primary_motivation: assessmentData.primary_motivation || '',
        specific_goals: assessmentData.specific_goals || [],
        timeline_expectation: assessmentData.timeline_expectation || '',
        commitment_level: assessmentData.commitment_level || '',
      };

      setAssessment(newAssessment);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error creating health assessment:', err);
      setError('Failed to save health assessment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssessment = async (updates: Partial<HealthAssessment>) => {
    if (!assessment) {
      setError('No assessment to update');
      return false;
    }

    setIsLoading(true);
    try {
      const updatedAssessment = { ...assessment, ...updates };
      setAssessment(updatedAssessment);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating health assessment:', err);
      setError('Failed to update health assessment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveAssessment = async (data: HealthAssessmentInput) => {
    if (assessment) {
      return await updateAssessment(data);
    } else {
      return await createAssessment(data);
    }
  };

  const isAssessmentComplete = () => {
    if (!assessment) return false;
    return !!(
      assessment.stress_level &&
      assessment.sleep_quality &&
      assessment.energy_level &&
      assessment.exercise_frequency
    );
  };

  return {
    assessment,
    isLoading,
    isSaving: isLoading,
    error,
    createAssessment,
    updateAssessment,
    saveAssessment,
    isAssessmentComplete: isAssessmentComplete(),
  };
};

export type { HealthAssessment, HealthAssessmentInput };
