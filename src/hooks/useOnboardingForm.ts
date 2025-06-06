
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

export interface OnboardingFormData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  body_fat_percentage: string;
  fitness_goal: string;
  activity_level: string;
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

export const useOnboardingForm = () => {
  // Initialize all hooks at the top level - never conditionally
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    body_fat_percentage: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  // Single effect to populate form data - avoid multiple effects
  useEffect(() => {
    // Only update if we have either user or profile data
    if (!user && !profile) return;

    const newFormData: Partial<OnboardingFormData> = {};

    // Populate from profile first (more complete data)
    if (profile) {
      if (profile.first_name) newFormData.first_name = profile.first_name;
      if (profile.last_name) newFormData.last_name = profile.last_name;
      if (profile.age) newFormData.age = profile.age.toString();
      if (profile.gender) newFormData.gender = profile.gender;
      if (profile.height) newFormData.height = profile.height.toString();
      if (profile.weight) newFormData.weight = profile.weight.toString();
      if (profile.nationality) newFormData.nationality = profile.nationality;
      if (profile.body_shape) newFormData.body_shape = profile.body_shape;
      if (profile.fitness_goal) newFormData.fitness_goal = profile.fitness_goal;
      if (profile.activity_level) newFormData.activity_level = profile.activity_level;
      if (profile.health_conditions) newFormData.health_conditions = profile.health_conditions;
      if (profile.allergies) newFormData.allergies = profile.allergies;
      if (profile.preferred_foods) newFormData.preferred_foods = profile.preferred_foods;
      if (profile.dietary_restrictions) newFormData.dietary_restrictions = profile.dietary_restrictions;
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
  }, [user, profile]); // Dependencies are stable

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
