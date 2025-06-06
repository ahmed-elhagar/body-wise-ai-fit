
import { useState } from "react";

export interface NewSignupFormData {
  // Step 1: Account Creation
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  
  // Step 2: Basic Info
  age: string;
  gender: string;
  
  // Step 3: Physical Stats
  height: string;
  weight: string;
  
  // Step 4: Body Composition (integrated shape + slider)
  body_shape: string;
  body_fat_percentage: number;
  
  // Step 5: Fitness Goals
  fitness_goal: string;
  activity_level: string;
  
  // Step 6: Health & Dietary (with autocomplete)
  health_conditions: string[];
  allergies: string[];
  dietary_restrictions: string[];
  
  // Step 7: Life Phase (for females only)
  pregnancy_trimester: string;
  breastfeeding_level: string;
  fasting_type: string;
}

export const useNewSignupForm = () => {
  const [formData, setFormData] = useState<NewSignupFormData>({
    // Step 1
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    
    // Step 2
    age: '',
    gender: '',
    
    // Step 3
    height: '',
    weight: '',
    
    // Step 4
    body_shape: '',
    body_fat_percentage: 20,
    
    // Step 5
    fitness_goal: '',
    activity_level: '',
    
    // Step 6
    health_conditions: [],
    allergies: [],
    dietary_restrictions: [],
    
    // Step 7
    pregnancy_trimester: 'none',
    breastfeeding_level: 'none',
    fasting_type: 'none',
  });

  const updateFormData = (field: string, value: string | string[] | number) => {
    console.log('Updating signup form data:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      body_shape: '',
      body_fat_percentage: 20,
      fitness_goal: '',
      activity_level: '',
      health_conditions: [],
      allergies: [],
      dietary_restrictions: [],
      pregnancy_trimester: 'none',
      breastfeeding_level: 'none',
      fasting_type: 'none',
    });
  };

  return {
    formData,
    updateFormData,
    resetForm,
  };
};
