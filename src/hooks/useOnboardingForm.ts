
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

export interface OnboardingFormData {
  // Basic Personal Information
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  
  // Body Composition
  body_shape: string;
  body_fat_percentage: string | number;
  
  // Fitness Goals & Preferences
  fitness_goal: string;
  activity_level: string;
  
  // Health Information
  health_conditions: string[];
  health_notes: string;
  allergies: string[];
  
  // Dietary Preferences
  preferred_foods: string[];
  dietary_restrictions: string[];
  
  // Special Conditions
  special_conditions: string[];
  pregnancy_trimester: string;
  breastfeeding_level: string;
  fasting_type: string;
}

export const useOnboardingForm = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Basic Personal Information
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    
    // Body Composition
    body_shape: '',
    body_fat_percentage: '',
    
    // Fitness Goals & Preferences
    fitness_goal: '',
    activity_level: '',
    
    // Health Information
    health_conditions: [],
    health_notes: '',
    allergies: [],
    
    // Dietary Preferences
    preferred_foods: [],
    dietary_restrictions: [],
    
    // Special Conditions
    special_conditions: [],
    pregnancy_trimester: 'none',
    breastfeeding_level: 'none',
    fasting_type: 'none',
  });

  // Populate form data from user and profile
  useEffect(() => {
    if (!user && !profile) return;

    const newFormData: Partial<OnboardingFormData> = {};

    // Populate from profile first (more complete data)
    if (profile) {
      // Basic Personal Information
      if (profile.first_name) newFormData.first_name = profile.first_name;
      if (profile.last_name) newFormData.last_name = profile.last_name;
      if (profile.age) newFormData.age = profile.age.toString();
      if (profile.gender) newFormData.gender = profile.gender;
      if (profile.height) newFormData.height = profile.height.toString();
      if (profile.weight) newFormData.weight = profile.weight.toString();
      if (profile.nationality) newFormData.nationality = profile.nationality;
      
      // Body Composition
      if (profile.body_shape) newFormData.body_shape = profile.body_shape;
      if (profile.body_fat_percentage !== undefined && profile.body_fat_percentage !== null) {
        newFormData.body_fat_percentage = profile.body_fat_percentage.toString();
      }
      
      // Fitness Goals & Preferences
      if (profile.fitness_goal) newFormData.fitness_goal = profile.fitness_goal;
      if (profile.activity_level) newFormData.activity_level = profile.activity_level;
      
      // Health Information
      if (profile.health_conditions) newFormData.health_conditions = profile.health_conditions;
      if (profile.health_notes) newFormData.health_notes = profile.health_notes;
      if (profile.allergies) newFormData.allergies = profile.allergies;
      
      // Dietary Preferences
      if (profile.preferred_foods) newFormData.preferred_foods = profile.preferred_foods;
      if (profile.dietary_restrictions) newFormData.dietary_restrictions = profile.dietary_restrictions;
      
      // Special Conditions
      if (profile.special_conditions && Array.isArray(profile.special_conditions)) {
        newFormData.special_conditions = profile.special_conditions;
      }
      if (profile.pregnancy_trimester) newFormData.pregnancy_trimester = profile.pregnancy_trimester.toString();
      if (profile.breastfeeding_level) newFormData.breastfeeding_level = profile.breastfeeding_level;
      if (profile.fasting_type) newFormData.fasting_type = profile.fasting_type;
    }

    // Fallback to user metadata if profile data is missing
    if (user?.user_metadata) {
      if (!newFormData.first_name && user.user_metadata.first_name) {
        newFormData.first_name = user.user_metadata.first_name;
      }
      if (!newFormData.last_name && user.user_metadata.last_name) {
        newFormData.last_name = user.user_metadata.last_name;
      }
    }

    // Only update if we have new data
    if (Object.keys(newFormData).length > 0) {
      setFormData(prev => ({ ...prev, ...newFormData }));
    }
  }, [user, profile]);

  const updateFormData = (field: string, value: string | string[] | number) => {
    console.log('Updating form data:', field, value);
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
