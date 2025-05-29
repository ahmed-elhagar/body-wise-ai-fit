
import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { useHealthAssessment } from "./useHealthAssessment";
import { useOnboardingProgress } from "./useOnboardingProgress";
import { toast } from "sonner";

export const useEnhancedProfile = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const { assessment, saveAssessment, isSaving: isSavingAssessment } = useHealthAssessment();
  const { markStepComplete } = useOnboardingProgress();
  
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    
    // Goals & Activity
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
    
    // Health Assessment
    chronic_conditions: [],
    medications: [],
    injuries: [],
    physical_limitations: [],
    stress_level: 5,
    sleep_quality: 7,
    energy_level: 7,
    work_schedule: '',
    exercise_history: '',
    nutrition_knowledge: '',
    cooking_skills: '',
    time_availability: '',
    primary_motivation: [],
    specific_goals: [],
    timeline_expectation: '',
    commitment_level: 7,
  });

  // Sync with profile and assessment data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (assessment) {
      setFormData(prev => ({
        ...prev,
        chronic_conditions: assessment.chronic_conditions || [],
        medications: assessment.medications || [],
        injuries: assessment.injuries || [],
        physical_limitations: assessment.physical_limitations || [],
        stress_level: assessment.stress_level || 5,
        sleep_quality: assessment.sleep_quality || 7,
        energy_level: assessment.energy_level || 7,
        work_schedule: assessment.work_schedule || '',
        exercise_history: assessment.exercise_history || '',
        nutrition_knowledge: assessment.nutrition_knowledge || '',
        cooking_skills: assessment.cooking_skills || '',
        time_availability: assessment.time_availability || '',
        primary_motivation: assessment.primary_motivation || [],
        specific_goals: assessment.specific_goals || [],
        timeline_expectation: assessment.timeline_expectation || '',
        commitment_level: assessment.commitment_level || 7,
      }));
    }
  }, [assessment]);

  const updateFormData = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const saveBasicInfo = async () => {
    try {
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality,
        body_shape: formData.body_shape,
      };
      
      await updateProfile(profileData);
      markStepComplete('basic_info');
      toast.success('Basic information saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information');
    }
  };

  const saveGoalsAndActivity = async () => {
    try {
      const profileData = {
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions,
      };
      
      await updateProfile(profileData);
      markStepComplete('goals_setup');
      toast.success('Goals and preferences saved successfully!');
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals and preferences');
    }
  };

  const saveHealthAssessment = async () => {
    try {
      const assessmentData = {
        chronic_conditions: formData.chronic_conditions,
        medications: formData.medications,
        injuries: formData.injuries,
        physical_limitations: formData.physical_limitations,
        stress_level: formData.stress_level,
        sleep_quality: formData.sleep_quality,
        energy_level: formData.energy_level,
        work_schedule: formData.work_schedule,
        exercise_history: formData.exercise_history,
        nutrition_knowledge: formData.nutrition_knowledge,
        cooking_skills: formData.cooking_skills,
        time_availability: formData.time_availability,
        primary_motivation: formData.primary_motivation,
        specific_goals: formData.specific_goals,
        timeline_expectation: formData.timeline_expectation,
        commitment_level: formData.commitment_level,
        assessment_type: 'enhanced_profile',
        health_score: calculateHealthScore(),
        readiness_score: calculateReadinessScore(),
        risk_score: calculateRiskScore(),
      };

      await saveAssessment(assessmentData);
      markStepComplete('health_assessment');
      toast.success('Health assessment saved successfully!');
    } catch (error) {
      console.error('Error saving health assessment:', error);
      toast.error('Failed to save health assessment');
    }
  };

  const calculateHealthScore = () => {
    let score = 50;
    score += (formData.sleep_quality - 5) * 5;
    score += (formData.energy_level - 5) * 3;
    score -= (formData.stress_level - 5) * 4;
    score -= formData.chronic_conditions.length * 5;
    score -= formData.medications.length * 3;
    score -= formData.injuries.length * 4;
    return Math.max(0, Math.min(100, score));
  };

  const calculateReadinessScore = () => {
    let score = 50;
    score += formData.commitment_level * 5;
    score += formData.energy_level * 3;
    if (formData.exercise_history === 'advanced' || formData.exercise_history === 'athlete') score += 15;
    if (formData.time_availability === 'flexible') score += 10;
    return Math.max(0, Math.min(100, score));
  };

  const calculateRiskScore = () => {
    let score = 10;
    score += formData.chronic_conditions.length * 15;
    score += formData.injuries.length * 10;
    score += formData.physical_limitations.length * 8;
    score += (10 - formData.sleep_quality) * 2;
    score += formData.stress_level * 3;
    return Math.max(0, Math.min(100, score));
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    saveHealthAssessment,
    isUpdating: isUpdating || isSavingAssessment,
  };
};
