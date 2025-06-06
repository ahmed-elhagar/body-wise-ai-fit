
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
  created_at?: string;
  updated_at?: string;
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
      // TODO: Implement actual database save
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

  return {
    assessment,
    isLoading,
    error,
    createAssessment,
    updateAssessment,
  };
};
