
import { useState } from "react";

export interface SignupFormData {
  // Account Creation
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  
  // Basic Info
  age: string;
  gender: string;
  
  // Physical Stats
  height: string;
  weight: string;
  
  // Body Composition (unified)
  bodyFatPercentage: number;
  
  // Fitness Goals
  fitnessGoal: string;
  activityLevel: string;
  
  // Health & Dietary
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  
  // Life Phase (for females only)
  pregnancyTrimester: string;
  breastfeedingLevel: string;
  fastingType: string;
}

export const useSignupFlow = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bodyFatPercentage: 20,
    fitnessGoal: '',
    activityLevel: '',
    healthConditions: [],
    allergies: [],
    dietaryRestrictions: [],
    pregnancyTrimester: 'none',
    breastfeedingLevel: 'none',
    fastingType: 'none',
  });

  const updateField = (field: string, value: string | string[] | number) => {
    console.log('Updating field:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      bodyFatPercentage: 20,
      fitnessGoal: '',
      activityLevel: '',
      healthConditions: [],
      allergies: [],
      dietaryRestrictions: [],
      pregnancyTrimester: 'none',
      breastfeedingLevel: 'none',
      fastingType: 'none',
    });
  };

  return {
    formData,
    updateField,
    resetForm,
  };
};
