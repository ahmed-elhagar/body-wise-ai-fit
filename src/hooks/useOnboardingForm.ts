
import { useState } from 'react';

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
  nationality: "",
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
