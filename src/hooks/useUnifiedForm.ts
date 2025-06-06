
import { useState } from "react";

export interface UnifiedFormData {
  // Step 1: Account Creation
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  
  // Step 2: Basic Physical Info
  age: string;
  gender: string;
  height: string;
  weight: string;
  
  // Step 3: Body Composition
  body_shape: string;
  body_fat_percentage: string | number;
  
  // Step 4: Goals & Activity
  fitness_goal: string;
  activity_level: string;
  
  // Step 5: Health & Dietary (optional)
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
  
  // Step 6: Special Conditions (females only, optional)
  special_conditions: string[];
  pregnancy_trimester: string;
  breastfeeding_level: string;
  fasting_type: string;
}

export const useUnifiedForm = () => {
  const [formData, setFormData] = useState<UnifiedFormData>({
    // Step 1: Account Creation
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    
    // Step 2: Basic Physical Info
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Step 3: Body Composition
    body_shape: '',
    body_fat_percentage: '',
    
    // Step 4: Goals & Activity
    fitness_goal: '',
    activity_level: '',
    
    // Step 5: Health & Dietary
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
    
    // Step 6: Special Conditions
    special_conditions: [],
    pregnancy_trimester: 'none',
    breastfeeding_level: 'none',
    fasting_type: 'none',
  });

  const updateFormData = (field: string, value: string | string[] | number) => {
    console.log('Updating unified form data:', field, value);
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
      body_fat_percentage: '',
      fitness_goal: '',
      activity_level: '',
      health_conditions: [],
      allergies: [],
      preferred_foods: [],
      dietary_restrictions: [],
      special_conditions: [],
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
