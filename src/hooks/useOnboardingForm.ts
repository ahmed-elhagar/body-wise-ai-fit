
import { useState } from "react";

export interface OnboardingFormData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  fitness_goal: string;
  activity_level: string;
  health_conditions: string;
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<OnboardingFormData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: '',
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
  };
};
