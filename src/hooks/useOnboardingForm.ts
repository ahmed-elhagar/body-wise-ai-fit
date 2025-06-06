import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';

export interface OnboardingFormData {
  // Basic Info
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  // Health & Goals
  body_shape: string;
  health_conditions: string[];
  fitness_goal: string;
  activity_level: string;
  // Nutrition
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

const initialFormData: OnboardingFormData = {
  // Basic Info
  first_name: "",
  last_name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  nationality: "prefer_not_to_say",
  // Health & Goals
  body_shape: "",
  health_conditions: [],
  fitness_goal: "",
  activity_level: "",
  // Nutrition
  allergies: [],
  preferred_foods: [],
  dietary_restrictions: []
};

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const { profile } = useProfile();

  // Pre-populate form with existing profile data
  useEffect(() => {
    if (profile) {
      console.log('Onboarding - Pre-populating form with profile data:', profile);
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        age: profile.age ? profile.age.toString() : "",
        gender: profile.gender || "",
        height: profile.height ? profile.height.toString() : "",
        weight: profile.weight ? profile.weight.toString() : "",
        nationality: profile.nationality || "prefer_not_to_say",
        body_shape: profile.body_shape || "",
        health_conditions: profile.health_conditions || [],
        fitness_goal: profile.fitness_goal || "",
        activity_level: profile.activity_level || "",
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || []
      }));
    }
  }, [profile]);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateFormData(field, items);
  };

  return {
    formData,
    updateFormData,
    handleArrayInput
  };
};
